const fs = require('fs');
const path = require('path');

const { Proyecto } = require('../models/proyectoManager');

const rutaArchivoProyecto = path.join(__dirname, '../data/proyectos.json');

// función leer archivo
const leerProyectos = () => {
    const data = fs.readFileSync(rutaArchivoProyecto, 'utf8');
    return JSON.parse(data);
};

// función guardar archivo
const guardarProyectos = (proyectos) => {
    fs.writeFileSync(
        rutaArchivoProyecto,
        JSON.stringify(proyectos, null, 2)
    );
};

// GET ALL
const obtenerProyecto = (req, res) => {
    const proyectos = leerProyectos();

    if (req.accepts('html')) {
        return res.render('proyectos/listar', { proyectos });
    }

    res.json(proyectos);
};

// GET BY ID
const obtenerProyectoPorId = (req, res) => {
    const proyectos = leerProyectos();
    const id = parseInt(req.params.idProyecto, 10);
    const proyecto = proyectos.find((p) => p.id === id || p.idProyecto === id);

    if (!proyecto) {
        return res.status(404).json({ message: 'Proyecto no encontrado' });
    }

    res.json(proyecto);
};

// CREATE (Secuencia numérica automática)
const crearProyecto = (req, res) => {
    const proyectos = leerProyectos();

    const ultimoId = proyectos.reduce((max, p) => {
        const idActual = Number(p.id || p.idProyecto || 0);
        return idActual > max ? idActual : max;
    }, 0);

    const nuevoProyecto = new Proyecto(
        req.body.idProyecto ? Number(req.body.idProyecto) : ultimoId + 1,
        req.body.nombre,
        req.body.organizacion,
        req.body.descripcion,
        req.body.ubicacion,
        req.body.categoria,
        Number(req.body.presupuestoObjetivo),
        req.body.moneda,
        req.body.fechaInicio,
        req.body.fechaFin,
        req.body.estado || 'activo',
        req.body.responsable,
        req.body.email_responsable
    );

    proyectos.push(nuevoProyecto);
    guardarProyectos(proyectos);

    if (req.accepts('html')) {
        return res.redirect('/proyecto');
    }

    res.status(201).json({
        mensaje: 'Proyecto creado',
        proyecto: nuevoProyecto
    });
};

// UPDATE
const actualizarProyecto = (req, res) => {
    const proyectos = leerProyectos();
    const id = parseInt(req.params.idProyecto, 10);
    const proyectoIndex = proyectos.findIndex((p) => p.id === id || p.idProyecto === id);

    if (proyectoIndex === -1) {
        return res.status(404).json({
            mensaje: 'Proyecto no encontrado'
        });
    }

    const {
        nombre,
        descripcion,
        organizacion,
        ubicacion,
        categoria,
        presupuestoObjetivo,
        moneda,
        fechaInicio,
        fechaFin,
        estado,
        responsable,
        email_responsable
    } = req.body;

    proyectos[proyectoIndex].nombre =
        nombre ?? proyectos[proyectoIndex].nombre;

    proyectos[proyectoIndex].descripcion =
        descripcion ?? proyectos[proyectoIndex].descripcion;

    proyectos[proyectoIndex].organizacion =
        organizacion ?? proyectos[proyectoIndex].organizacion;

    proyectos[proyectoIndex].ubicacion =
        ubicacion ?? proyectos[proyectoIndex].ubicacion;

    proyectos[proyectoIndex].categoria =
        categoria ?? proyectos[proyectoIndex].categoria;

    proyectos[proyectoIndex].presupuestoObjetivo =
        presupuestoObjetivo !== undefined
            ? Number(presupuestoObjetivo)
            : proyectos[proyectoIndex].presupuestoObjetivo;

    proyectos[proyectoIndex].moneda =
        moneda ?? proyectos[proyectoIndex].moneda;

    proyectos[proyectoIndex].fechaInicio =
        fechaInicio ?? proyectos[proyectoIndex].fechaInicio;

    proyectos[proyectoIndex].fechaFin =
        fechaFin ?? proyectos[proyectoIndex].fechaFin;

    proyectos[proyectoIndex].estado =
        estado ?? proyectos[proyectoIndex].estado;

    proyectos[proyectoIndex].responsable =
        responsable ?? proyectos[proyectoIndex].responsable;

    proyectos[proyectoIndex].email_responsable =
        email_responsable ?? proyectos[proyectoIndex].email_responsable;

    guardarProyectos(proyectos);
    res.json({
        mensaje: 'Proyecto actualizado',
        proyecto: proyectos[proyectoIndex]
    });
};

// DELETE (Soporta web y API)
const eliminarProyecto = (req, res) => {
    const proyectos = leerProyectos();
    const id = parseInt(req.params.idProyecto, 10);
    const nuevosProyectos = proyectos.filter((p) => (p.id !== id && p.idProyecto !== id));

    if (proyectos.length === nuevosProyectos.length) {
        if (req.accepts('html')) {
            return res.status(404).send("Error: Proyecto no encontrado. <a href='/proyecto'>Volver</a>");
        }
        return res.status(404).json({ mensaje: 'Proyecto no encontrado' });
    }

    guardarProyectos(nuevosProyectos);

    if (req.accepts('html')) {
        return res.redirect('/proyecto');
    }

    res.json({ mensaje: 'Proyecto eliminado' });
};

module.exports = {
    obtenerProyecto,
    obtenerProyectoPorId,
    crearProyecto,
    actualizarProyecto,
    eliminarProyecto
};