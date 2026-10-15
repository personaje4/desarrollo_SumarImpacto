const mongoose = require('mongoose');
const DonanteCorporativo = require('../models/donanteCorporativoManager');

const CAMPOS = [
    'razonSocial', 'cuit', 'rubro', 'personaContacto', 'emailContacto',
    'montoTotalDonado', 'moneda', 'estado'
];

// Lee el id de la URL (API) o del formulario web (la ruta POST /eliminar lo copia a req.params)
const leerId = (req) => req.params.idDonante || req.params.idDonanteCorporativo;

// El formulario puede enviar el proyecto como proyectoAsignado o como proyectoAsignadoId
const leerProyecto = (body) => body.proyectoAsignado ?? body.proyectoAsignadoId;

// Hace populate solo si el modelo Proyecto ya está registrado (depende de la migración de Adriana)
const conProyecto = (consulta) =>
    mongoose.modelNames().includes('Proyecto')
        ? consulta.populate('proyectoAsignado')
        : consulta;

const idInvalido = (req, res) => {
    if (req.accepts('html')) {
        return res.status(400).send("Error: ID inválido. <a href='/donanteCorporativo'>Volver</a>");
    }
    return res.status(400).json({ mensaje: 'ID inválido' });
};

const manejarError = (err, req, res) => {
    if (err.code === 11000) {
        return res.status(409).json({ mensaje: 'Ya existe un donante con ese CUIT' });
    }
    if (err.name === 'ValidationError' || err.name === 'CastError') {
        return res.status(400).json({ mensaje: err.message });
    }
    console.error(err);
    return res.status(500).json({ mensaje: 'Error interno del servidor' });
};

// GET ALL
const obtenerDonanteCorporativo = async (req, res) => {
    try {
        const donantes = await conProyecto(DonanteCorporativo.find()).lean();

        if (req.accepts('html')) {
            return res.render('donantes/listar', { donantes });
        }
        res.json(donantes);
    } catch (err) {
        manejarError(err, req, res);
    }
};

// GET BY ID
const obtenerDonanteCorporativoPorId = async (req, res) => {
    try {
        const id = leerId(req);
        if (!mongoose.isValidObjectId(id)) return idInvalido(req, res);

        const donante = await conProyecto(DonanteCorporativo.findById(id)).lean();
        if (!donante) {
            return res.status(404).json({ message: 'Donante corporativo no encontrado' });
        }
        res.json(donante);
    } catch (err) {
        manejarError(err, req, res);
    }
};

// CREATE (el _id lo genera MongoDB)
const crearDonanteCorporativo = async (req, res) => {
    try {
        
        const datos = {};
        CAMPOS.forEach((c) => {
            if (req.body[c] !== undefined && req.body[c] !== '') datos[c] = req.body[c];
        });

        const proyecto = leerProyecto(req.body);
        console.log('🟢 proyecto que llegó:', JSON.stringify(proyecto));
        console.log('🟢 tipo:', typeof proyecto);
        console.log('🟢 largo:', proyecto ? proyecto.length : 'vacío');
        if (proyecto) {
            if (!mongoose.isValidObjectId(proyecto)) {
                return res.status(400).json({ mensaje: 'proyectoAsignado inválido' });
                
            }
            datos.proyectoAsignado = proyecto;
        }

        const nuevoDonante = await DonanteCorporativo.create(datos);

        if (req.accepts('html')) {
            return res.redirect('/donanteCorporativo');
        }
        res.status(201).json({
            mensaje: 'Donante corporativo creado',
            donante: nuevoDonante
        });
    } catch (err) {
        manejarError(err, req, res);
    }
};

// UPDATE
const actualizarDonanteCorporativo = async (req, res) => {
    try {
        const id = leerId(req);
        if (!mongoose.isValidObjectId(id)) return idInvalido(req, res);

        const cambios = {};
        CAMPOS.forEach((c) => {
            if (req.body[c] !== undefined) cambios[c] = req.body[c];
        });

        const proyecto = leerProyecto(req.body);
        if (proyecto !== undefined) {
            if (proyecto !== null && proyecto !== '' && !mongoose.isValidObjectId(proyecto)) {
                return res.status(400).json({ mensaje: 'proyectoAsignado inválido' });
            }
            cambios.proyectoAsignado = proyecto || null;
        }

        const donante = await DonanteCorporativo.findByIdAndUpdate(id, cambios, {
            new: true,
            runValidators: true
        });

        if (!donante) {
            return res.status(404).json({ mensaje: 'Donante corporativo no encontrado' });
        }
        res.json({
            mensaje: 'Donante corporativo actualizado',
            donante
        });
    } catch (err) {
        manejarError(err, req, res);
    }
};

// DELETE (Soporta web y API)
const eliminarDonanteCorporativo = async (req, res) => {
    try {
        const id = leerId(req);
        if (!mongoose.isValidObjectId(id)) return idInvalido(req, res);

        const eliminado = await DonanteCorporativo.findByIdAndDelete(id);

        if (!eliminado) {
            if (req.accepts('html')) {
                return res.status(404).send("Error: Donante no encontrado. <a href='/donanteCorporativo'>Volver</a>");
            }
            return res.status(404).json({ mensaje: 'Donante corporativo no encontrado' });
        }

        if (req.accepts('html')) {
            return res.redirect('/donanteCorporativo');
        }
        res.json({ mensaje: 'Donante corporativo eliminado' });
    } catch (err) {
        manejarError(err, req, res);
    }
};

module.exports = {
    obtenerDonanteCorporativo,
    obtenerDonanteCorporativoPorId,
    crearDonanteCorporativo,
    actualizarDonanteCorporativo,
    eliminarDonanteCorporativo
};
