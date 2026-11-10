const { test } = require('node:test');
const assert = require('node:assert/strict');
const app = require('../index');

test('Middlewares de David: Rutas 404 y JSON malformado', async (t) => {
    const server = await new Promise(resolve => {
        const s = app.listen(0, '127.0.0.1', () => resolve(s));
    });
    const base = `http://127.0.0.1:${server.address().port}`;

    try {
        await t.test('Ruta inexistente devuelve 404 controlado en JSON', async () => {
            const res = await fetch(`${base}/ruta-inexistente-de-prueba`, {
                headers: { Accept: 'application/json' }
            });
            assert.equal(res.status, 404);
            const body = await res.json();
            assert.equal(body.mensaje, 'Ruta no encontrada');
        });

        await t.test('JSON malformado devuelve 400 controlado', async () => {
            const res = await fetch(`${base}/donanteCorporativo`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    Accept: 'application/json'
                },
                body: '{"razonSocial": "Test", ' // JSON roto sin cerrar
            });
            assert.equal(res.status, 400);
            const body = await res.json();
            assert.equal(body.mensaje, 'JSON inválido en el cuerpo de la solicitud');
        });
    } finally {
        await new Promise(resolve => server.close(resolve));
    }
});