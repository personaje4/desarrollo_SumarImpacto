const mongoose = require('mongoose');
const schema = new mongoose.Schema({
    idDonanteCorporativo: { type: Number, min: 1, validate: Number.isSafeInteger },
    razonSocial: { type: String, required: true, trim: true },
    cuit: { type: String, required: true, unique: true, trim: true,
        set: v => typeof v === 'string' ? v.replace(/[-\s]/g, '') : v, match: /^\d{11}$/ },
    rubro: { type: String, trim: true },
    personaContacto: { type: String, trim: true },
    emailContacto: { type: String, trim: true, lowercase: true,
        validate: v => !v || /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v) },
    montoTotalDonado: { type: Number, default: 0, min: 0, validate: Number.isFinite },
    moneda: { type: String, trim: true, enum: ['ARS', 'USD'], default: 'ARS' },
    proyectoAsignado: { type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto', default: null },
    estado: { type: String, trim: true, lowercase: true, enum: ['activo', 'inactivo'], default: 'activo' }
}, { timestamps: true });
module.exports = mongoose.model('DonanteCorporativo', schema);
