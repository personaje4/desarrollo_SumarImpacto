const express = require("express");
const {
  mostrarLogin,
  mostrarRegistro,
  registrarUsuario,
  iniciarSesion,
  cerrarSesion
} = require("../controllers/authController");
const { protegerRuta } = require("../middlewares/authMiddleware");

const router = express.Router();

router.get("/login", mostrarLogin);
router.post("/login", iniciarSesion);

router.get("/registro", mostrarRegistro);
router.post("/registro", registrarUsuario);

router.post("/logout", protegerRuta, cerrarSesion);

module.exports = router;