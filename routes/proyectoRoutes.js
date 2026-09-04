const express = require('express');
const router = express.Router();
const {
  obtenerProyecto,
  obtenerProyectoPorId,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto
} = require('../controllers/proyectoController');

// rutas CRUD
router.get('/', obtenerProyecto);
router.get('/:idProyecto', obtenerProyectoPorId);
router.post('/', crearProyecto);
router.put('/:idProyecto', actualizarProyecto);
router.delete('/:idProyecto', eliminarProyecto);

module.exports = router;