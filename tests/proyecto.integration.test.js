const { test } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const app = require('../index');
const Proyecto = require('../models/proyectoManager');

// Usar exclusivamente una base descartable cuyo nombre termine en _test.
const uri = process.env.MONGODB_URI_TEST;
const ejemplo = {
    nombre: 'Proyecto de prueba', organizacion: 'Organización de prueba',
    descripcion: 'Prueba de integración', ubicacion: 'Buenos Aires', categoria: 'Educación',
    presupuestoObjetivo: 100.50, moneda: 'ARS', fechaInicio: '2026-10-15',
    fechaFin: '', estado: 'En ejecución', responsable: 'Prueba',
    email_responsable: 'prueba@example.com'
};

test('Proyecto: CRUD HTTP, formularios, validaciones y persistencia MongoDB', async (t) => {
    assert.ok(uri, 'Definir MONGODB_URI_TEST con una base descartable terminada en _test');
    assert.match(new URL(uri).pathname, /_test$/);
    let server;
    let base;
    async function escuchar() {
        server = await new Promise(resolve => {
            const s = app.listen(0, '127.0.0.1', () => resolve(s));
        });
        base = `http://127.0.0.1:${server.address().port}`;
    }
    async function cerrar() {
        if (server) await new Promise((resolve, reject) => server.close(e => e ? reject(e) : resolve()));
        server = null;
    }
    async function solicitar(path, method = 'GET', body, web = false) {
        const headers = { Accept: web ? 'text/html' : 'application/json' };
        if (body !== undefined) headers['Content-Type'] = web ? 'application/x-www-form-urlencoded' : 'application/json';
        return fetch(base + path, { method, headers, redirect: 'manual',
            body: body === undefined ? undefined : web ? new URLSearchParams(body) : JSON.stringify(body) });
    }
    let id;
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        await Proyecto.init();
        await Proyecto.deleteMany({});
        await escuchar();
        await t.test('Inicio, donantes y formularios se renderizan', async () => {
            for (const path of ['/', '/donanteCorporativo', '/proyecto/nuevo', '/proyecto/eliminar']) {
                const r = await solicitar(path, 'GET', undefined, true);
                assert.equal(r.status, 200, path);
                assert.match(await r.text(), /<html/);
            }
        });
        await t.test('Listado vacío por API y web', async () => {
            assert.deepEqual(await (await solicitar('/proyecto')).json(), []);
            assert.equal((await solicitar('/proyecto', 'GET', undefined, true)).status, 200);
        });
        await t.test('Alta sin fecha de fin, ID automático y estado normalizado', async () => {
            const r = await solicitar('/proyecto', 'POST', ejemplo);
            assert.equal(r.status, 201);
            const { proyecto } = await r.json();
            id = proyecto._id;
            assert.equal(proyecto.idProyecto, 1);
            assert.equal(proyecto.fechaFin, null);
            assert.equal(proyecto.estado, 'en ejecución');
        });
        await t.test('Consulta por ObjectId y número histórico', async () => {
            for (const valor of [id, '1']) {
                const r = await solicitar('/proyecto/' + valor);
                assert.equal(r.status, 200);
                assert.equal((await r.json()).nombre, ejemplo.nombre);
            }
        });
        await t.test('Vista de listado y edición con valores guardados', async () => {
            const listado = await (await solicitar('/proyecto', 'GET', undefined, true)).text();
            assert.ok(listado.includes(id));
            const r = await solicitar('/proyecto/' + id + '/editar', 'GET', undefined, true);
            assert.equal(r.status, 200);
            const html = await r.text();
            assert.ok(html.includes('value="Proyecto de prueba"'));
            assert.ok(html.includes('value="2026-10-15"'));
        });
        await t.test('Datos inválidos responden 400 y no crean registros', async () => {
            for (const datos of [{ nombre: '' }, { presupuestoObjetivo: -1 },
                { email_responsable: 'incorrecto' }, { estado: 'desconocido' },
                { moneda: 'OTRA' }, { fechaInicio: 'incorrecta' },
                { fechaFin: '2026-10-14' }, { idProyecto: 1.5 }]) {
                const r = await solicitar('/proyecto', 'POST', { ...ejemplo, ...datos });
                assert.equal(r.status, 400, JSON.stringify(datos));
            }
            assert.equal(await Proyecto.countDocuments(), 1);
        });
        await t.test('Identificador duplicado responde 409', async () => {
            assert.equal((await solicitar('/proyecto', 'POST', { ...ejemplo, idProyecto: 1 })).status, 409);
        });
        await t.test('ID inválido 400; ID válido inexistente 404', async () => {
            for (const method of ['GET', 'PUT', 'DELETE']) {
                const body = method === 'PUT' ? { nombre: 'Prueba' } : undefined;
                assert.equal((await solicitar('/proyecto/invalido', method, body)).status, 400);
                assert.equal((await solicitar('/proyecto/000000000000000000000000', method, body)).status, 404);
            }
        });
        await t.test('Modificación parcial y validación contra fecha existente', async () => {
            assert.equal((await solicitar('/proyecto/' + id, 'PUT', { nombre: 'Actualizado', fechaFin: '2026-10-20' })).status, 200);
            assert.equal((await solicitar('/proyecto/' + id, 'PUT', { fechaInicio: '2026-10-21' })).status, 400);
            const p = await (await solicitar('/proyecto/' + id)).json();
            assert.equal(p.nombre, 'Actualizado');
            assert.equal(p.fechaInicio.slice(0, 10), '2026-10-15');
        });
        await t.test('Edición por formulario y redirección a /proyecto', async () => {
            const r = await solicitar('/proyecto/' + id + '/editar', 'POST', { nombre: 'Edición web', fechaFin: '' }, true);
            assert.equal(r.status, 302);
            assert.equal(r.headers.get('location'), '/proyecto');
        });
        await t.test('JSON sin Accept explícito también recibe JSON', async () => {
            const r = await fetch(base + '/proyecto', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ejemplo), redirect: 'manual' });
            assert.equal(r.status, 201);
            assert.match(r.headers.get('content-type'), /application\/json/);
        });
        await t.test('Persistencia al cerrar servidor/conexión y reabrir', async () => {
            await cerrar();
            await mongoose.disconnect();
            await mongoose.connect(uri);
            await escuchar();
            const r = await solicitar('/proyecto/' + id);
            assert.equal(r.status, 200);
            assert.equal((await r.json()).nombre, 'Edición web');
        });
        await t.test('Alta y baja web con ObjectId', async () => {
            const r = await solicitar('/proyecto', 'POST', ejemplo, true);
            assert.equal(r.status, 302);
            assert.equal(r.headers.get('location'), '/proyecto');
            const p = await Proyecto.findOne().sort({ idProyecto: -1 });
            const baja = await solicitar('/proyecto/eliminar', 'POST', { idProyecto: p._id.toString() }, true);
            assert.equal(baja.status, 302);
            assert.equal(await Proyecto.findById(p._id), null);
        });
        await t.test('Baja API y segunda baja inexistente', async () => {
            assert.equal((await solicitar('/proyecto/' + id, 'DELETE')).status, 200);
            assert.equal((await solicitar('/proyecto/' + id)).status, 404);
            assert.equal((await solicitar('/proyecto/' + id, 'DELETE')).status, 404);
        });
    } finally {
        await cerrar();
        if (mongoose.connection.readyState === 1) await Proyecto.deleteMany({});
        await mongoose.disconnect();
    }
});
