const { test } = require('node:test');
const assert = require('node:assert/strict');
const pug = require('pug');
const Donante = require('../models/donanteCorporativoManager');
const Proyecto = require('../models/proyectoManager');
const { prepararDonantes } = require('../scripts/migrarDonantes');
const app = require('../index');
const ejemplo = { razonSocial: 'Empresa <script>', cuit: '30-12345678-9', estado: 'Activo' };

test('Donante: normalización y valores predeterminados', async () => {
    const d = new Donante(ejemplo);
    await d.validate();
    assert.equal(d.cuit, '30123456789');
    assert.equal(d.estado, 'activo');
    assert.equal(d.montoTotalDonado, 0);
    assert.equal(d.proyectoAsignado, null);
});
test('Donante: rechaza campos inválidos', async () => {
    for (const cambio of [{ razonSocial: ' ' }, { cuit: 'abc' }, { montoTotalDonado: -1 },
        { montoTotalDonado: Infinity }, { moneda: 'EUR' }, { estado: 'otro' },
        { emailContacto: 'incorrecto' }, { idDonanteCorporativo: 1.5 }]) {
        await assert.rejects(new Donante({ ...ejemplo, ...cambio }).validate(), { name: 'ValidationError' });
    }
});
test('Donante: vistas con ObjectId, selección de proyecto y texto escapado', () => {
    const p = new Proyecto({ idProyecto: 1, nombre: 'Proyecto <script>' });
    const d = new Donante({ ...ejemplo, proyectoAsignado: p._id });
    for (const vista of ['nuevo', 'editar', 'listar', 'eliminar']) {
        const html = pug.renderFile('views/donantes/' + vista + '.pug', { donante: d,
            donantes: [{ ...d.toObject(), proyectoAsignado: p }], proyectos: [p] });
        assert.match(html, /<html/);
        assert.ok(!html.includes('<script>'));
        if (vista === 'editar') {
            assert.ok(html.includes('/' + d._id + '/editar'));
            assert.ok(html.includes('value="' + p._id + '" selected'));
        }
    }
});
test('Migración: valida todos los registros y resuelve por idProyecto', async t => {
    const p = new Proyecto({ idProyecto: 2, nombre: 'Proyecto' });
    t.mock.method(Proyecto, 'findOne', async filtro => filtro.idProyecto === 2 ? p : null);
    const datos = await prepararDonantes([{ ...ejemplo, idDonanteCorporativo: 7, proyectoAsignadoId: 2 }]);
    assert.equal(String(datos[0].proyectoAsignado), String(p._id));
    assert.equal(datos[0].idDonanteCorporativo, 7);
    await assert.rejects(prepararDonantes([{ ...ejemplo, proyectoAsignadoId: 99 }]), /No existe/);
    await assert.rejects(prepararDonantes([ejemplo, ejemplo]), /duplicado/);
});
test('HTTP Donante: 400, 404 y JSON sin Accept; sin base real', async t => {
    t.mock.method(Donante, 'findOne', () => ({ populate: async () => null }));
    t.mock.method(Donante, 'findOneAndDelete', async () => null);
    t.mock.method(Donante, 'create', async datos => new Donante(datos));
    t.mock.method(Proyecto, 'findOne', async () => null);
    const server = await new Promise(resolve => { const s = app.listen(0, '127.0.0.1', () => resolve(s)); });
    const base = 'http://127.0.0.1:' + server.address().port + '/donanteCorporativo';
    try {
        assert.equal((await fetch(base + '/invalido')).status, 400);
        assert.equal((await fetch(base + '/000000000000000000000000')).status, 404);
        const r = await fetch(base, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(ejemplo), redirect: 'manual' });
        assert.equal(r.status, 201);
        assert.match(r.headers.get('content-type'), /json/);
        const invalido = await fetch(base, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...ejemplo, proyectoAsignadoId: 99 }) });
        assert.equal(invalido.status, 400);
    } finally { await new Promise(resolve => server.close(resolve)); }
});
