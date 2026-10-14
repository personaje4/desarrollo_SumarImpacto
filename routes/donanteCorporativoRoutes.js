const express = require('express');
const router = express.Router();
const {
  obtenerDonanteCorporativo,
  obtenerDonanteCorporativoPorId,
  crearDonanteCorporativo,
  actualizarDonanteCorporativo,
  eliminarDonanteCorporativo
} = require('../controllers/donanteCorporativoController');

// 1. Listar donantes
router.get('/', obtenerDonanteCorporativo);

// 2. Formulario para nuevo donante
router.get('/nuevo', (req, res) => {
  res.render('donantes/nuevo');
});

// 3. Formulario para eliminar donante
router.get('/eliminar', (req, res) => {
  res.render('donantes/eliminar');
});

// 4. Procesar la eliminación desde el formulario web
router.post('/eliminar', (req, res) => {
  req.params.idDonante = req.body.idDonante;
  eliminarDonanteCorporativo(req, res);
});

// 5. Obtener un donante por ID (debe ir después de /nuevo y /eliminar)
router.get('/:idDonante', obtenerDonanteCorporativoPorId);

// 6. Crear donante desde formulario o API
router.post('/', crearDonanteCorporativo);

// 7. Actualizar donante
router.put('/:idDonante', actualizarDonanteCorporativo);

// 8. Eliminar donante desde API (ThunderClient)
router.delete('/:idDonante', eliminarDonanteCorporativo);

module.exports = router;