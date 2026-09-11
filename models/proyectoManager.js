const fs = require('fs');
const path = require('path');

const rutaArchivoProyecto = path.join(__dirname, '../data/proyectos.json');

class Proyecto {
    constructor(idProyecto, nombre, organizacion,descripcion, fechaInicio, fechaFin, estado, responsable, email_responsable) {
        this.idProyecto = idProyecto;
        this.nombre = nombre;
        this.organizacion = organizacion;
        this.descripcion = descripcion;
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

module.exports = { Proyecto, ProyectoManager };