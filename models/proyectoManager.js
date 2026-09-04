const fs = require('fs');
const path = require('path');

const rutaArchivoProyecto = path.join(__dirname, '../data/proyectos.json');

class Proyecto {
    constructor(idProyecto, nombre, descripcion, fechaInicio, fechaFin, estado) {
        this.idProyecto = idProyecto;
        this.nombre = nombre;
        this.descripcion = descripcion;
        this.fechaInicio = fechaInicio;
        this.fechaFin = fechaFin;
        this.estado = estado;
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