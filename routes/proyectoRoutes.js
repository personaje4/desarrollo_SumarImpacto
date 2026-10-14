const express = require('express');
const router = express.Router();
const {
  obtenerProyecto,
  obtenerProyectoPorId,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto
} = require('../controllers/proyectoController');

// 1. Listar proyectos
router.get('/', obtenerProyecto);

// 2. Formulario para nuevo proyecto
router.get('/nuevo', (req, res) => {
  res.render('proyectos/nuevo');
});

// 3. Formulario para eliminar proyecto
router.get('/eliminar', (req, res) => {
  res.render('proyectos/eliminar');
});

// 4. Procesar la eliminación desde el formulario web
router.post('/eliminar', (req, res) => {
  req.params.idProyecto = req.body.idProyecto;
  eliminarProyecto(req, res);
});

// 5. Obtener un proyecto por ID (debe ir después de /nuevo y /eliminar)
router.get('/:idProyecto', obtenerProyectoPorId);

// 6. Crear proyecto desde formulario o API
router.post('/', crearProyecto);

// 7. Actualizar proyecto
router.put('/:idProyecto', actualizarProyecto);

// 8. Eliminar proyecto desde API (ThunderClient)
router.delete('/:idProyecto', eliminarProyecto);

module.exports = router;