const crypto = require("crypto");
const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nombre: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  salt: {
    type: String,
    required: true
  },
  rol: {
    type: String,
    enum: ["admin", "lector"],
    default: "lector"
  },
  sesionToken: {
    type: String,
    default: null
  }
}, {
  timestamps: true
});

usuarioSchema.methods.validarPassword = function(password) {
  const hash = crypto
    .pbkdf2Sync(password, this.salt, 10000, 64, "sha512")
    .toString("hex");

  return this.passwordHash === hash;
};

usuarioSchema.statics.crearPasswordSeguro = function(password) {
  const salt = crypto.randomBytes(16).toString("hex");
  const passwordHash = crypto
    .pbkdf2Sync(password, salt, 10000, 64, "sha512")
    .toString("hex");

  return { salt, passwordHash };
};

module.exports = mongoose.model("Usuario", usuarioSchema);