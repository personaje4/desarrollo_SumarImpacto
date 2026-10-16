const { test } = require('node:test');
const assert = require('node:assert/strict');
const mongoose = require('mongoose');
const app = require('../index');
const Donante = require('../models/donanteCorporativoManager');
const Proyecto = require('../models/proyectoManager');
const { prepararDonantes } = require('../scripts/migrarDonantes');
const uri = process.env.MONGODB_URI_TEST;

test('Donante: CRUD, formularios, relación con Proyecto y persistencia MongoDB', async t => {
    assert.ok(uri, 'Definir MONGODB_URI_TEST con una base descartable terminada en _test');
    assert.match(new URL(uri).pathname, /_test$/);
    let server, base, id, proyecto;
    const datos = { razonSocial: 'Empresa de prueba', cuit: '30-12345678-9',
        personaContacto: 'Contacto', emailContacto: 'contacto@example.com', moneda: 'ARS', montoTotalDonado: 0 };
    async function abrir() {
        server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
        base = 'http://127.0.0.1:' + server.address().port;
    }
    async function cerrar() { if (server) await new Promise(resolve => server.close(resolve)); server = null; }
    async function pedir(ruta, method = 'GET', body, web = false) {
        const headers = { Accept: web ? 'text/html' : 'application/json' };
        if (body !== undefined) headers['Content-Type'] = web ? 'application/x-www-form-urlencoded' : 'application/json';
        return fetch(base + ruta, { method, headers, redirect: 'manual', body: body === undefined ? undefined : web ? new URLSearchParams(body) : JSON.stringify(body) });
    }
    const ruta = '/donanteCorporativo';
    try {
        await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
        await Promise.all([Donante.init(), Proyecto.init()]);
        await Donante.deleteMany({});
        await Proyecto.deleteMany({});
        proyecto = await Proyecto.create({ idProyecto: 1, nombre: 'Proyecto de prueba', organizacion: 'ONG',
            descripcion: 'Descripción', ubicacion: 'CABA', categoria: 'Educación', presupuestoObjetivo: 100,
            moneda: 'ARS', fechaInicio: '2026-10-15', estado: 'planificación', responsable: 'Prueba', email_responsable: 'prueba@example.com' });
        await abrir();
        await t.test('Listados y formularios', async () => {
            assert.deepEqual(await (await pedir(ruta)).json(), []);
            for (const p of [ruta, ruta + '/nuevo', ruta + '/eliminar']) assert.equal((await pedir(p, 'GET', undefined, true)).status, 200);
            const html = await (await pedir(ruta + '/nuevo', 'GET', undefined, true)).text();
            assert.ok(html.includes(String(proyecto._id)));
        });
        await t.test('Alta por ID histórico de proyecto y consulta con populate', async () => {
            const r = await pedir(ruta, 'POST', { ...datos, proyectoAsignadoId: 1 });
            assert.equal(r.status, 201);
            id = (await r.json()).donante._id;
            const d = await (await pedir(ruta + '/' + id)).json();
            assert.equal(d.cuit, '30123456789');
            assert.equal(d.proyectoAsignado.nombre, proyecto.nombre);
            assert.equal(d.estado, 'activo');
        });
        await t.test('Rechaza CUIT duplicado aun con otro formato', async () => {
            assert.equal((await pedir(ruta, 'POST', { ...datos, cuit: '30123456789' })).status, 409);
        });
        await t.test('Rechaza datos inválidos y proyectos inexistentes sin insertar', async () => {
            for (const cambio of [{ cuit: 'abc' }, { razonSocial: '' }, { montoTotalDonado: -1 },
                { emailContacto: 'error' }, { moneda: 'EUR' }, { estado: 'otro' },
                { proyectoAsignado: 'invalido' }, { proyectoAsignado: '000000000000000000000000' }]) {
                assert.equal((await pedir(ruta, 'POST', { ...datos, cuit: '30111111111', ...cambio })).status, 400, JSON.stringify(cambio));
            }
            assert.equal(await Donante.countDocuments(), 1);
        });
        await t.test('IDs inválidos 400 e inexistentes 404', async () => {
            for (const method of ['GET','PUT','DELETE']) {
                const body = method === 'PUT' ? {} : undefined;
                assert.equal((await pedir(ruta + '/invalido', method, body)).status, 400);
                assert.equal((await pedir(ruta + '/000000000000000000000000', method, body)).status, 404);
            }
        });
        await t.test('Edición parcial, ObjectId de proyecto y desvinculación', async () => {
            assert.equal((await pedir(ruta + '/' + id, 'PUT', { razonSocial: 'Actualizada', proyectoAsignado: String(proyecto._id) })).status, 200);
            assert.equal((await pedir(ruta + '/' + id, 'PUT', { proyectoAsignadoId: 999 })).status, 400);
            assert.equal((await pedir(ruta + '/' + id, 'PUT', { proyectoAsignado: '' })).status, 200);
            assert.equal((await Donante.findById(id)).proyectoAsignado, null);
        });
        await t.test('Edición web y bloqueo de baja de proyecto vinculado', async () => {
            const r = await pedir(ruta + '/' + id + '/editar', 'POST', { proyectoAsignado: String(proyecto._id) }, true);
            assert.equal(r.status, 302);
            assert.equal(r.headers.get('location'), ruta);
            const html = await (await pedir(ruta + '/' + id + '/editar', 'GET', undefined, true)).text();
            assert.ok(html.includes('value="' + proyecto._id + '" selected'));
            assert.equal((await pedir('/proyecto/' + proyecto._id, 'DELETE')).status, 409);
            assert.ok(await Proyecto.findById(proyecto._id));
        });
        await t.test('JSON sin Accept devuelve JSON y alta/baja web', async () => {
            const r = await fetch(base + ruta, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...datos, cuit: '30222222222' }), redirect: 'manual' });
            assert.equal(r.status, 201);
            assert.match(r.headers.get('content-type'), /json/);
            assert.equal((await pedir(ruta, 'POST', { ...datos, cuit: '30333333333' }, true)).status, 302);
            const d = await Donante.findOne({ cuit: '30333333333' });
            assert.equal((await pedir(ruta + '/eliminar', 'POST', { idDonante: String(d._id) }, true)).status, 302);
            assert.equal(await Donante.findById(d._id), null);
        });
        await t.test('Persistencia al cerrar y reabrir HTTP y Mongoose', async () => {
            await cerrar(); await mongoose.disconnect(); await mongoose.connect(uri); await abrir();
            const d = await (await pedir(ruta + '/' + id)).json();
            assert.equal(d.razonSocial, 'Actualizada');
            assert.equal(d.proyectoAsignado.nombre, proyecto.nombre);
        });
        await t.test('Preparación de importación, repetición e ID histórico', async () => {
            const [d] = await prepararDonantes([{ ...datos, cuit: '30444444444', idDonanteCorporativo: 88, proyectoAsignadoId: 1 }]);
            for (let i = 0; i < 2; i++) await Donante.updateOne({ cuit: d.cuit }, { $setOnInsert: d }, { upsert: true, runValidators: true });
            assert.equal(await Donante.countDocuments({ cuit: d.cuit }), 1);
            assert.equal((await (await pedir(ruta + '/88')).json()).idDonanteCorporativo, 88);
            await assert.rejects(prepararDonantes([{ ...datos, proyectoAsignadoId: 99 }]), /No existe/);
        });
        await t.test('Baja API, repetición 404 y baja de proyecto sin vínculos', async () => {
            assert.equal((await pedir(ruta + '/' + id, 'DELETE')).status, 200);
            assert.equal((await pedir(ruta + '/' + id, 'DELETE')).status, 404);
            await Donante.updateMany({}, { $set: { proyectoAsignado: null } });
            assert.equal((await pedir('/proyecto/' + proyecto._id, 'DELETE')).status, 200);
        });
    } finally {
        await cerrar();
        if (mongoose.connection.readyState === 1) { await Donante.deleteMany({}); await Proyecto.deleteMany({}); }
        await mongoose.disconnect();
    }
});
