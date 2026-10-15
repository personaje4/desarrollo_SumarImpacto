const express = require('express');
const router = express.Router();
const { obtenerProyecto, obtenerProyectoPorId, obtenerProyectoEditar,
    crearProyecto, actualizarProyecto, eliminarProyecto } = require('../controllers/proyectoController');

router.get('/', obtenerProyecto);
router.get('/nuevo', (req, res) => res.render('proyectos/nuevo'));
router.get('/eliminar', (req, res) => res.render('proyectos/eliminar'));
router.post('/eliminar', eliminarProyecto);
router.get('/:idProyecto/editar', obtenerProyectoEditar);
router.post('/:idProyecto/editar', actualizarProyecto);
router.get('/:idProyecto', obtenerProyectoPorId);
router.post('/', crearProyecto);
router.put('/:idProyecto', actualizarProyecto);
router.delete('/:idProyecto', eliminarProyecto);

module.exports = router;
