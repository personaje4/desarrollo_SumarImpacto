const mongoose = require('mongoose');

const textoRequerido = { type: String, required: true, trim: true };
const proyectoSchema = new mongoose.Schema({
    idProyecto: { type: Number, required: true, unique: true, min: 1,
        validate: { validator: Number.isSafeInteger, message: 'idProyecto debe ser un entero positivo' } },
    nombre: textoRequerido,
    organizacion: textoRequerido,
    descripcion: textoRequerido,
    ubicacion: textoRequerido,
    categoria: textoRequerido,
    presupuestoObjetivo: { type: Number, required: true, min: 0 },
    moneda: { type: String, required: true, enum: ['ARS', 'USD'] },
    fechaInicio: { type: Date, required: true },
    fechaFin: { type: Date, default: null },
    estado: { type: String, required: true, trim: true, lowercase: true,
        enum: ['planificación', 'en ejecución', 'finalizado', 'cancelado'] },
    responsable: textoRequerido,
    email_responsable: { ...textoRequerido, match: /^[^\s@]+@[^\s@]+\.[^\s@]+$/ }
}, { timestamps: true });

proyectoSchema.pre('validate', function () {
    if (this.fechaFin && this.fechaInicio && this.fechaFin < this.fechaInicio) {
        this.invalidate('fechaFin', 'La fecha de fin no puede ser anterior a la fecha de inicio');
    }
});

module.exports = mongoose.model('Proyecto', proyectoSchema);
