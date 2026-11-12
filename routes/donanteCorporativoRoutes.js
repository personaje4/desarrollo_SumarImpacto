const { Router } = require('express');
const c = require('../controllers/donanteCorporativoController');
const { soloAdmin } = require('../middlewares/authMiddleware');

const router = Router();

// Lectura: cualquier usuario logueado
router.get('/', c.obtenerDonanteCorporativo);

// Escritura: solo admin
router.get('/nuevo', soloAdmin, c.formularioDonante);
router.get('/eliminar', soloAdmin, (req, res) => res.render('donantes/eliminar'));
router.post('/eliminar', soloAdmin, c.eliminarDonanteCorporativo);
router.get('/:idDonante/editar', soloAdmin, c.formularioDonante);
router.post('/:idDonante/editar', soloAdmin, c.actualizarDonanteCorporativo);

// Lectura
router.get('/:idDonante', c.obtenerDonanteCorporativoPorId);

// Escritura: solo admin
router.post('/', soloAdmin, c.crearDonanteCorporativo);
router.put('/:idDonante', soloAdmin, c.actualizarDonanteCorporativo);
router.delete('/:idDonante', soloAdmin, c.eliminarDonanteCorporativo);

module.exports = router;