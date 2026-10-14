import mongoose from "mongoose";

const proyectoSchema = new mongoose.Schema({
    idProyecto: {
        type: Number,
        required: true,
        unique: true
    },
    nombre: {
        type: String,
        required: true
    },
    organizacion: {
        type: String,
        required: true
    },
    descripcion: {
        type: String,
        required: true
    },
    ubicacion: {
        type: String,
        required: true
    },
    categoria: {
        type: String,
        required: true
    },
    presupuestoObjetivo: {
        type: Number,
        required: true
    },
    moneda: {
        type: String,
        required: true
    },
    fechaInicio:{ 
        type: Date, 
        required: true 
    },
    fechaFin: {
        type: Date, 
        required: true 
    },
    estado: { 
        type: String, 
        required: true 
    },
    responsable: { 
        type: String, 
        required: true 
    },
    email_responsable: { 
        type: String, 
        required: true 
    }
},{
    timestamps: true
});
export default mongoose.model("Proyecto", proyectoSchema);

/*const Proyecto = mongoose.model('Proyecto', proyectoSchema);

class Proyecto {
    constructor(
        idProyecto,
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
    ) {
        this.idProyecto = idProyecto;
        this.nombre = nombre;
        this.organizacion = organizacion;
        this.descripcion = descripcion;
        this.ubicacion = ubicacion;
        this.categoria = categoria;
        this.presupuestoObjetivo = presupuestoObjetivo;
        this.moneda = moneda;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.estado = estado;
        this.responsable = responsable;
        this.email_responsable = email_responsable;
    }
}

class ProyectoManager {
    leerProyectos() {
        const data = fs.readFileSync(rutaArchivoProyecto, 'utf8');
        return JSON.parse(data);
    }

    guardarProyectos(proyectos) {
        fs.writeFileSync(rutaArchivoProyecto, JSON.stringify(proyectos, null, 2));
    }

    obtenerTodos() {
        return this.leerProyectos();
    }

    obtenerPorId(id) {
        const proyectos = this.leerProyectos();
        return proyectos.find((p) => p.idProyecto === parseInt(id, 10) || p.id === parseInt(id, 10));
    }
}

module.exports = { Proyecto, ProyectoManager };*/