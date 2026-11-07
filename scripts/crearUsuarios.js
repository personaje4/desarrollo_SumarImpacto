require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
const mongoose = require('mongoose');
const conectarDB = require('../config/database');
const Usuario = require('../models/Usuario');

(async () => {
  await conectarDB();
  await Usuario.deleteMany({ email: { $in: ['admin@test.com', 'usuario@test.com'] } });

  const a = Usuario.crearPasswordSeguro('admin123');
  const u = Usuario.crearPasswordSeguro('usuario123');

  await Usuario.create([
    { nombre: 'Admin Prueba', email: 'admin@test.com', ...a, rol: 'admin' },
    { nombre: 'Usuario Prueba', email: 'usuario@test.com', ...u, rol: 'usuario' }
  ]);

  console.log('Usuarios de prueba creados');
  await mongoose.disconnect();
})();