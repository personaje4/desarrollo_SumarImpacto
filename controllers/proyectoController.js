const fs = require('fs');
const path = require('path');

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

// CREATE
const crearProyecto = (req, res) => {
    const proyectos = leerProyectos();
    const nuevoProyecto = req.body;

    proyectos.push(nuevoProyecto);
    guardarProyectos(proyectos);
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

    const { nombre, descripcion, organizacion, fechaInicio, fechaFin, estado, responsable, email_responsable} = req.body;
    proyectos[proyectoIndex].nombre = nombre ?? proyectos[proyectoIndex].nombre;
    proyectos[proyectoIndex].descripcion = descripcion ?? proyectos[proyectoIndex].descripcion;
    proyectos[proyectoIndex].organizacion = organizacion ?? proyectos[proyectoIndex].organizacion;
    proyectos[proyectoIndex].fechaInicio = fechaInicio ?? proyectos[proyectoIndex].fechaInicio;
    proyectos[proyectoIndex].fechaFin = fechaFin ?? proyectos[proyectoIndex].fechaFin;
    proyectos[proyectoIndex].estado = estado ?? proyectos[proyectoIndex].estado;
    proyectos[proyectoIndex].responsable = responsable ?? proyectos[proyectoIndex].responsable;
    proyectos[proyectoIndex].email_responsable = email_responsable ?? proyectos[proyectoIndex].email_responsable;

    guardarProyectos(proyectos);
    res.json({
        mensaje: 'Proyecto actualizado',
        proyecto: proyectos[proyectoIndex]
    });
};

// DELETE   
const eliminarProyecto = (req, res) => {
    const proyectos = leerProyectos();
    const id = parseInt(req.params.idProyecto, 10);
    const nuevosProyectos = proyectos.filter((p) => p.id !== id && p.idProyecto !== id);

    if (proyectos.length === nuevosProyectos.length) {
        return res.status(404).json({ 
            mensaje: 'Proyecto no encontrado' 
        });
    }

    guardarProyectos(nuevosProyectos);
    res.json({ 
        mensaje: 'Proyecto eliminado'
    });
};

module.exports = {
    obtenerProyecto,
    obtenerProyectoPorId,
    crearProyecto,
    actualizarProyecto,
    eliminarProyecto    
};