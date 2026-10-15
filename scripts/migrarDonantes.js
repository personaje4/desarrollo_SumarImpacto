// Migra data/donanteCorporativo.json a MongoDB.
// Ejecutar desde la raíz del proyecto:  node scripts/migrarDonantes.js
//
// Es idempotente: usa el CUIT como clave, así que correrlo dos veces no duplica donantes.
// Requiere que los proyectos ya estén cargados en Mongo (migración de Adriana).
// El vínculo se resuelve por nombre: JSON de proyectos (id numérico) -> nombre -> _id en Mongo.

require('dotenv').config();
const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');

const conectarDB = require('../config/database'); // ajustar la ruta si database.js está en otra carpeta
const DonanteCorporativo = require('../models/donanteCorporativoManager');

const leerJSON = (ruta) => JSON.parse(fs.readFileSync(path.join(__dirname, ruta), 'utf8'));

(async () => {
    try {
        await conectarDB();

        const donantes = leerJSON('../data/donanteCorporativo.json');
        const proyectosJson = leerJSON('../data/proyectos.json');
        const Proyecto = mongoose.modelNames().includes('Proyecto')
            ? mongoose.model('Proyecto')
            : require('../models/proyectoManager').Proyecto; // ajustar según cómo lo exporte Adriana

        for (const d of donantes) {
            let proyectoAsignado;

            const viejo = proyectosJson.find(
                (p) => (p.id ?? p.idProyecto) === d.proyectoAsignadoId
            );
            if (viejo) {
                const nuevo = await Proyecto.findOne({ nombre: viejo.nombre });
                if (nuevo) proyectoAsignado = nuevo._id;
            }
            if (!proyectoAsignado) {
                console.warn(`Aviso: ${d.razonSocial} queda sin proyecto (no se encontró el proyecto ${d.proyectoAsignadoId} en Mongo)`);
            }

            await DonanteCorporativo.findOneAndUpdate(
                { cuit: d.cuit },
                {
                    razonSocial: d.razonSocial,
                    cuit: d.cuit,
                    rubro: d.rubro,
                    personaContacto: d.personaContacto,
                    emailContacto: d.emailContacto,
                    montoTotalDonado: d.montoTotalDonado,
                    moneda: d.moneda,
                    estado: d.estado,
                    proyectoAsignado
                },
                { upsert: true, new: true, runValidators: true, setDefaultsOnInsert: true }
            );
            console.log(`OK: ${d.razonSocial}`);
        }

        console.log(`Migración terminada: ${donantes.length} donantes procesados.`);
    } catch (err) {
        console.error('Error en la migración:', err.message);
        process.exitCode = 1;
    } finally {
        await mongoose.disconnect();
    }
})();
