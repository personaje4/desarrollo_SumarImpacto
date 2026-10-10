const mongoose = require('mongoose');

async function conectarDB() {
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error('Falta MONGODB_URI. Configurá el archivo .env.');
  }
  await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
  console.log('Conexión a MongoDB establecida');
}

module.exports = conectarDB;
