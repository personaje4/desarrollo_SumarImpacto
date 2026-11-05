// Comprueba acceso a la base configurada sin insertar ni eliminar documentos.
require('dotenv').config({ path: require('path').join(__dirname, '..', '.env'), quiet: true });
const mongoose = require('mongoose');
const conectarDB = require('../config/database');

async function comprobarConexion() {
  try {
    await conectarDB();
    await mongoose.connection.db.command({ ping: 1 });
    console.log('Comprobación correcta: la base respondió al ping. No se modificaron documentos.');
  } catch {
    // No imprimir la URI ni errores que puedan contener credenciales.
    console.error('No se pudo comprobar la conexión. Revisá MONGODB_URI, el usuario, la contraseña y el acceso de red.');
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
}

comprobarConexion();
