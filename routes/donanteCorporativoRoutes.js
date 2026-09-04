const express = require('express');
const router = express.Router();
const {
  obtenerDonanteCorporativo,
  obtenerDonanteCorporativoPorId,
  crearDonanteCorporativo,
  actualizarDonanteCorporativo,
  eliminarDonanteCorporativo
} = require('../controllers/donanteCorporativoController');

// rutas CRUD

router.get('/', obtenerDonanteCorporativo);
router.get('/:idDonante', obtenerDonanteCorporativoPorId);
router.post('/', crearDonanteCorporativo);
router.put('/:idDonante', actualizarDonanteCorporativo);
router.delete('/:idDonante', eliminarDonanteCorporativo);  

module.exports = router;