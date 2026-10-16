// Por defecto solo verifica. --aplicar importa en la base indicada por MONGODB_URI.
require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
const conectarDB = require('../config/database');
const Donante = require('../models/donanteCorporativoManager');
const Proyecto = require('../models/proyectoManager');

async function prepararDonantes(donantes) {
    const preparados = [];
    const cuits = new Set();
    for (const d of donantes) {
        const datos = {};
        for (const c of ['idDonanteCorporativo','razonSocial','cuit','rubro','personaContacto',
            'emailContacto','montoTotalDonado','moneda','estado']) if (d[c] !== undefined) datos[c] = d[c];
        datos.proyectoAsignado = null;
        if (d.proyectoAsignadoId != null && d.proyectoAsignadoId !== '') {
            const id = Number(d.proyectoAsignadoId);
            if (!Number.isSafeInteger(id) || id < 1) throw new Error('ID histórico de proyecto inválido');
            const proyecto = await Proyecto.findOne({ idProyecto: id });
            if (!proyecto) throw new Error('No existe en MongoDB el proyecto histórico ' + id + '. No se importaron donantes.');
            datos.proyectoAsignado = proyecto._id;
        }
        const documento = new Donante(datos);
        await documento.validate();
        if (cuits.has(documento.cuit)) throw new Error('CUIT duplicado en el archivo: ' + documento.cuit);
        cuits.add(documento.cuit);
        const limpio = documento.toObject();
        delete limpio._id;
        preparados.push(limpio);
    }
    return preparados;
}
async function ejecutar() {
    try {
        if (process.argv.slice(2).some(a => a !== '--aplicar')) throw new Error('Único argumento admitido: --aplicar');
        await conectarDB();
        const donantes = JSON.parse(fs.readFileSync(path.join(__dirname, '../data/donanteCorporativo.json'), 'utf8'));
        if (!Array.isArray(donantes)) throw new Error('Se esperaba un arreglo de donantes');
        const preparados = await prepararDonantes(donantes);
        if (!process.argv.includes('--aplicar')) {
            console.log('Verificación sin escrituras: ' + preparados.length + ' donantes válidos. Use --aplicar para importar.');
            return;
        }
        await Donante.init();
        for (const d of preparados) {
            // Una repetición no sobrescribe ediciones posteriores del usuario.
            const resultado = await Donante.updateOne({ cuit: d.cuit }, { $setOnInsert: d },
                { upsert: true, runValidators: true, setDefaultsOnInsert: true });
            console.log(d.razonSocial + ': ' + (resultado.upsertedCount ? 'importado' : 'ya existía, conservado'));
        }
    } catch (err) {
        console.error('Error en la migración:', err.message);
        process.exitCode = 1;
    } finally { await mongoose.disconnect(); }
}
if (require.main === module) ejecutar();
module.exports = { prepararDonantes };

