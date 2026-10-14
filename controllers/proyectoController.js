import Proyecto from '../models/proyectoManager.js';


// VISTA PRINCIPAL
const obtenerProyectosVista = async (req, res) => {
    try {
        const proyectos = await Proyecto.find().sort({IDProyecto: 1});
        res.render("index", { proyectos });
    } catch (error) { 
        console.error(error);
        res.status(500).send("Error al obtener los proyectos");     

        }
    };

    //FORMULARIO DE EDICION
const obtenerProyectoEditar = async (req, res) => {
    try {
        const proyecto = await Proyecto.findById(req.params.id);
        if (!proyecto) {
            return res.status(404).send("Proyecto no encontrado");
        }
        res.render("editarProyecto", { proyecto });
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al obtener el proyecto");
    }
};

// CREATE (Secuencia numérica automática)
const crearProyecto = async (req, res) => {
    try {
    const {IDProyecto, nombre, organizacion, descripcion, ubicacion, categoria, presupuestoObjetivo, moneda, fechaInicio, fechaFin, estado, responsable, email_responsable } = req.body;
    const nuevoProyecto = new Proyecto({
        IDProyecto,
        nombre,
        organizacion,
        descripcion,
        ubicacion,
        categoria,
        presupuestoObjetivo,
        moneda,
        fechaInicio,
        fechaFin,
        estado,
        responsable,
        email_responsable
        });

        await nuevoProyecto.save();
        res.redirect("/proyectos");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al crear el proyecto");
    }
};  
   
// UPDATE
const actualizarProyecto = async (req, res) => {
    try {
        const {
            IDProyecto,
            nombre,
            organizacion,
            descripcion,
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

        const proyectoActualizado = await Proyecto.findByIdAndUpdate(
            req.params.id,
            {
                IDProyecto,
                nombre,
                organizacion,
                descripcion,
                ubicacion,
                categoria,
                presupuestoObjetivo,
                moneda,
                fechaInicio,
                fechaFin,
                estado,
                responsable,
                email_responsable
            },
            { new: true, runValidators: true }
        );

        if (!proyectoActualizado) {
            return res.status(404).send("Proyecto no encontrado");
        }

        res.redirect("/proyectos");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al actualizar proyecto");
    }
};

// DELETE 
const eliminarProyecto = async (req, res) => {
    try {
        const proyectoEliminado = await Proyecto.findByIdAndDelete(req.params.id);
        if (!proyectoEliminado) {
            return res.status(404).send("Proyecto no encontrado");
        }
        res.redirect("/proyectos");
    } catch (error) {
        console.error(error);
        res.status(500).send("Error al eliminar proyecto");
    }
};

export {
    obtenerProyectosVista,
    obtenerProyectoEditar,
    crearProyecto,
    actualizarProyecto,
    eliminarProyecto,

};