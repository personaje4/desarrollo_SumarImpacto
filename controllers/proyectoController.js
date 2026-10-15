const mongoose = require('mongoose');
const Proyecto = require('../models/proyectoManager');

const campos = ['nombre', 'organizacion', 'descripcion', 'ubicacion', 'categoria',
    'presupuestoObjetivo', 'moneda', 'fechaInicio', 'fechaFin', 'estado',
    'responsable', 'email_responsable'];

// Formularios: vistas y redirecciones. Solicitudes JSON: respuestas JSON.
const esWeb = (req) => !req.is('application/json') &&
    req.accepts(['html', 'json']) === 'html';

function datosProyecto(body = {}) {
    const datos = {};
    for (const campo of campos) {
        if (body[campo] !== undefined) datos[campo] = body[campo];
    }
    if (typeof datos.fechaFin === 'string' && !datos.fechaFin.trim()) datos.fechaFin = null;
    return datos;
}

// Se acepta ObjectId o el número histórico del proyecto.
function filtroId(id) {
    if (/^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id))) {
        return { idProyecto: Number(id) };
    }
    if (mongoose.isObjectIdOrHexString(id)) return { _id: id };
    const error = new Error('Identificador de proyecto inválido');
    error.status = 400;
    throw error;
}

function responderError(res, error) {
    if (error.code === 11000) return res.status(409).json({ mensaje: 'El número de proyecto ya existe; vuelva a intentar con otro número o con asignación automática' });
    const status = error.status || (['ValidationError', 'CastError'].includes(error.name) ? 400 : 500);
    if (status === 500) console.error(error);
    return res.status(status).json({ mensaje: status === 500 ? 'Error al procesar el proyecto' : error.message });
}

const obtenerProyecto = async (req, res) => {
    try {
        const proyectos = await Proyecto.find().sort({ idProyecto: 1 });
        if (esWeb(req)) return res.render('proyectos/listar', { proyectos });
        return res.json(proyectos);
    } catch (error) { return responderError(res, error); }
};

const obtenerProyectoPorId = async (req, res) => {
    try {
        const proyecto = await Proyecto.findOne(filtroId(req.params.idProyecto));
        if (!proyecto) return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
        return res.json(proyecto);
    } catch (error) { return responderError(res, error); }
};

const obtenerProyectoEditar = async (req, res) => {
    try {
        const proyecto = await Proyecto.findOne(filtroId(req.params.idProyecto));
        if (!proyecto) return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
        return res.render('proyectos/editar', { proyecto });
    } catch (error) { return responderError(res, error); }
};

const crearProyecto = async (req, res) => {
    try {
        const body = req.body || {};
        const datos = datosProyecto(body);
        if (body.idProyecto !== undefined && body.idProyecto !== '') {
            datos.idProyecto = body.idProyecto;
        } else {
            const ultimo = await Proyecto.findOne().sort({ idProyecto: -1 });
            datos.idProyecto = ultimo ? ultimo.idProyecto + 1 : 1;
        }
        const proyecto = await Proyecto.create(datos);
        if (esWeb(req)) return res.redirect('/proyecto');
        return res.status(201).json({ mensaje: 'Proyecto creado', proyecto });
    } catch (error) { return responderError(res, error); }
};

const actualizarProyecto = async (req, res) => {
    try {
        const proyecto = await Proyecto.findOne(filtroId(req.params.idProyecto));
        if (!proyecto) return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
        // Los identificadores de un registro existente no se modifican.
        proyecto.set(datosProyecto(req.body));
        await proyecto.save();
        if (esWeb(req)) return res.redirect('/proyecto');
        return res.json({ mensaje: 'Proyecto actualizado', proyecto });
    } catch (error) { return responderError(res, error); }
};

const eliminarProyecto = async (req, res) => {
    try {
        const id = req.params.idProyecto || req.body.idProyecto;
        const proyecto = await Proyecto.findOneAndDelete(filtroId(id));
        if (!proyecto) return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
        if (esWeb(req)) return res.redirect('/proyecto');
        return res.json({ mensaje: 'Proyecto eliminado' });
    } catch (error) { return responderError(res, error); }
};

module.exports = { obtenerProyecto, obtenerProyectoPorId, obtenerProyectoEditar,
    crearProyecto, actualizarProyecto, eliminarProyecto };
