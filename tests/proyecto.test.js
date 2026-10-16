const { test } = require('node:test');
const assert = require('node:assert/strict');
const pug = require('pug');
const Proyecto = require('../models/proyectoManager');
const app = require('../index');
const Donante = require('../models/donanteCorporativoManager');

const ejemplo = {
    idProyecto: 1, nombre: 'Proyecto de prueba', organizacion: 'Organización',
    descripcion: 'Descripción', ubicacion: 'Buenos Aires', categoria: 'Educación',
    presupuestoObjetivo: 0, moneda: 'ARS', fechaInicio: '2026-10-15',
    estado: 'En ejecución', responsable: 'Prueba', email_responsable: 'prueba@example.com'
};

test('Modelo: documento válido, presupuesto cero y fin opcional', async () => {
    const p = new Proyecto(ejemplo);
    await p.validate();
    assert.equal(p.fechaFin, null);
    assert.equal(p.estado, 'en ejecución');
});

test('Modelo: campos, números, estado, moneda, correo y fechas inválidos', async () => {
    for (const datos of [{ nombre: '   ' }, { idProyecto: 1.5 }, { presupuestoObjetivo: -1 },
        { estado: 'otro' }, { moneda: 'OTRA' }, { email_responsable: 'inválido' },
        { fechaInicio: 'incorrecta' }, { fechaFin: '2026-10-14' }]) {
        await assert.rejects(new Proyecto({ ...ejemplo, ...datos }).validate(), { name: 'ValidationError' });
    }
});

test('Modelo: modificación de fecha inicial valida contra fecha final existente', async () => {
    const p = new Proyecto({ ...ejemplo, fechaFin: '2026-10-20' });
    await p.validate();
    p.fechaInicio = '2026-10-21';
    await assert.rejects(p.validate(), { name: 'ValidationError' });
});

test('Pug: listado, alta, eliminación y edición con datos y caracteres escapados', () => {
    const p = new Proyecto({ ...ejemplo, nombre: '<script>prueba</script>' });
    for (const vista of ['listar', 'nuevo', 'eliminar', 'editar']) {
        const html = pug.renderFile(`views/proyectos/${vista}.pug`, { proyecto: p, proyectos: [p] });
        assert.match(html, /<html/);
        assert.ok(!html.includes('<script>prueba</script>'));
        if (vista === 'editar') {
            assert.ok(html.includes('value="2026-10-15"'));
            assert.ok(html.includes(`/proyecto/${p._id}/editar`));
        }
    }
});

test('HTTP: rutas web, identificadores inválidos y 404 con consulta simulada', async (t) => {
    // Esta simulación prueba rutas/respuestas. No demuestra conexión ni persistencia.
    t.mock.method(Proyecto, 'findOne', async () => null);
    t.mock.method(Proyecto, 'findOneAndDelete', async () => null);
    t.mock.method(Donante, 'find', () => ({ populate: () => ({ lean: async () => [] }) }));
    const server = await new Promise(resolve => {
        const s = app.listen(0, '127.0.0.1', () => resolve(s));
    });
    const base = `http://127.0.0.1:${server.address().port}`;
    try {
        for (const path of ['/', '/donanteCorporativo', '/proyecto/nuevo', '/proyecto/eliminar']) {
            assert.equal((await fetch(base + path)).status, 200, path);
        }
        for (const method of ['GET', 'PUT', 'DELETE']) {
            const opts = { method, headers: { Accept: 'application/json', 'Content-Type': 'application/json' } };
            if (method === 'PUT') opts.body = '{}';
            assert.equal((await fetch(base + '/proyecto/invalido', opts)).status, 400);
            assert.equal((await fetch(base + '/proyecto/000000000000000000000000', opts)).status, 404);
        }
    } finally {
        await new Promise((resolve, reject) => server.close(e => e ? reject(e) : resolve()));
    }
});

