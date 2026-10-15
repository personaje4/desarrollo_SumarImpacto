const mongoose = require('mongoose');

const donanteCorporativoSchema = new mongoose.Schema(
  {
    razonSocial: { type: String, required: true, trim: true },
    cuit: { type: String, required: true, unique: true, trim: true },
    rubro: { type: String, trim: true },
    personaContacto: { type: String, trim: true },
    emailContacto: { type: String, trim: true, lowercase: true },
    montoTotalDonado: { type: Number, default: 0, min: 0 },
    moneda: { type: String, trim: true },
    // Un donante tiene un solo proyecto. El nombre 'Proyecto' debe coincidir
    // con el que Adriana registre en mongoose.model('Proyecto', ...).
    proyectoAsignado: { type: mongoose.Schema.Types.ObjectId, ref: 'Proyecto' },
    estado: { type: String, trim: true, default: 'Activo' }
  },
  { timestamps: true }
);

module.exports = mongoose.model('DonanteCorporativo', donanteCorporativoSchema);