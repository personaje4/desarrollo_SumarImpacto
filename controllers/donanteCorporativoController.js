const mongoose = require('mongoose');
const Donante = require('../models/donanteCorporativoManager');
const Proyecto = require('../models/proyectoManager');
const CAMPOS = ['razonSocial', 'cuit', 'rubro', 'personaContacto', 'emailContacto',
    'montoTotalDonado', 'moneda', 'estado'];
const esWeb = req => !req.is('application/json') && req.accepts(['html', 'json']) === 'html';
const fallo = (mensaje, status = 400) => Object.assign(new Error(mensaje), { status });
function filtroId(id) {
    if (mongoose.isObjectIdOrHexString(id)) return { _id: id };
    if (/^[1-9]\d*$/.test(id) && Number.isSafeInteger(Number(id))) return { idDonanteCorporativo: Number(id) };
    throw fallo('Identificador de donante inválido');
}
function errorRespuesta(res, err) {
    if (err.code === 11000) return res.status(409).json({ mensaje: 'Ya existe un donante con ese CUIT' });
    const status = err.status || (['ValidationError', 'CastError'].includes(err.name) ? 400 : 500);
    if (status === 500) console.error(err);
    return res.status(status).json({ mensaje: status === 500 ? 'Error interno del servidor' : err.message });
}
async function datosDonante(body = {}) {
    const datos = {};
    for (const campo of CAMPOS) if (body[campo] !== undefined) datos[campo] = body[campo];
    if (datos.montoTotalDonado === '') datos.montoTotalDonado = 0;
    const valor = body.proyectoAsignado !== undefined ? body.proyectoAsignado : body.proyectoAsignadoId;
    if (valor === undefined) return datos;
    if (valor === null || valor === '') { datos.proyectoAsignado = null; return datos; }
    let filtro;
    if (typeof valor === 'string' && mongoose.isObjectIdOrHexString(valor)) filtro = { _id: valor };
    else if ((typeof valor === 'string' || typeof valor === 'number') && /^[1-9]\d*$/.test(String(valor)) && Number.isSafeInteger(Number(valor))) filtro = { idProyecto: Number(valor) };
    else throw fallo('Identificador de proyecto inválido');
    const proyecto = await Proyecto.findOne(filtro);
    if (!proyecto) throw fallo('El proyecto asignado no existe');
    datos.proyectoAsignado = proyecto._id;
    return datos;
}
const leerId = req => req.params.idDonante || req.params.idDonanteCorporativo || req.body?.idDonante;
const obtenerDonanteCorporativo = async (req, res) => {
    try {
        const donantes = await Donante.find().populate('proyectoAsignado').lean();
        return esWeb(req) ? res.render('donantes/listar', { donantes }) : res.json(donantes);
    } catch (err) { return errorRespuesta(res, err); }
};
const obtenerDonanteCorporativoPorId = async (req, res) => {
    try {
        const donante = await Donante.findOne(filtroId(leerId(req))).populate('proyectoAsignado');
        if (!donante) throw fallo('Donante corporativo no encontrado', 404);
        return res.json(donante);
    } catch (err) { return errorRespuesta(res, err); }
};
const formularioDonante = async (req, res) => {
    try {
        let donante = null;
        if (req.params.idDonante) {
            donante = await Donante.findOne(filtroId(leerId(req)));
            if (!donante) throw fallo('Donante corporativo no encontrado', 404);
        }
        const proyectos = await Proyecto.find().sort({ idProyecto: 1 });
        return res.render(donante ? 'donantes/editar' : 'donantes/nuevo', { donante, proyectos });
    } catch (err) { return errorRespuesta(res, err); }
};
const crearDonanteCorporativo = async (req, res) => {
    try {
        const donante = await Donante.create(await datosDonante(req.body));
        return esWeb(req) ? res.redirect('/donanteCorporativo') : res.status(201).json({ mensaje: 'Donante corporativo creado', donante });
    } catch (err) { return errorRespuesta(res, err); }
};
const actualizarDonanteCorporativo = async (req, res) => {
    try {
        const donante = await Donante.findOne(filtroId(leerId(req)));
        if (!donante) throw fallo('Donante corporativo no encontrado', 404);
        donante.set(await datosDonante(req.body));
        await donante.save();
        return esWeb(req) ? res.redirect('/donanteCorporativo') : res.json({ mensaje: 'Donante corporativo actualizado', donante });
    } catch (err) { return errorRespuesta(res, err); }
};
const eliminarDonanteCorporativo = async (req, res) => {
    try {
        const donante = await Donante.findOneAndDelete(filtroId(leerId(req)));
        if (!donante) throw fallo('Donante corporativo no encontrado', 404);
        return esWeb(req) ? res.redirect('/donanteCorporativo') : res.json({ mensaje: 'Donante corporativo eliminado' });
    } catch (err) { return errorRespuesta(res, err); }
};
module.exports = { obtenerDonanteCorporativo, obtenerDonanteCorporativoPorId,
    formularioDonante, crearDonanteCorporativo, actualizarDonanteCorporativo, eliminarDonanteCorporativo };

