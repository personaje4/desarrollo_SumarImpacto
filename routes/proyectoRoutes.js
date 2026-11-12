const { Router } = require('express');
const c = require('../controllers/proyectoController');
const { soloAdmin } = require('../middlewares/authMiddleware');

const router = Router();

router.get('/', c.obtenerProyecto);
router.get('/nuevo', soloAdmin, (req, res) => res.render('proyectos/nuevo'));
router.get('/eliminar', soloAdmin, (req, res) => res.render('proyectos/eliminar'));
router.post('/eliminar', soloAdmin, c.eliminarProyecto);
router.get('/:idProyecto/editar', soloAdmin, c.obtenerProyectoEditar);
router.post('/:idProyecto/editar', soloAdmin, c.actualizarProyecto);
router.get('/:idProyecto', c.obtenerProyectoPorId);
router.post('/', soloAdmin, c.crearProyecto);
router.put('/:idProyecto', soloAdmin, c.actualizarProyecto);
router.delete('/:idProyecto', soloAdmin, c.eliminarProyecto);

module.exports = router;