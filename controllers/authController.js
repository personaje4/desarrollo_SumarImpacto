const crypto = require("crypto"); // Módulo nativo de Node.js para operaciones criptográficas y generación de tokens seguros.
const Usuario = require("../models/usuario"); // Modelo de Usuario para interactuar con MongoDB.

const mostrarLogin = (req, res) => {
  res.render("login", { // Muestra la vista de inicio de sesión.
    error: null // Inicialmente no hay mensajes de error.
  });
};

const mostrarRegistro = (req, res) => {
  res.render("registro", { // Muestra la vista de registro de usuarios.
    error: null // Inicialmente no hay mensajes de error.
  });
};

const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password } = req.body; // Obtiene los datos enviados desde el formulario.

    if (!nombre || !email || !password) {
      return res.render("registro", {
        error: "Todos los campos son obligatorios" // Valida que todos los campos estén completos.
      });
    }
    const usuarioExiste = await Usuario.findOne({ email }); // Busca si ya existe un usuario con ese email.

    if (usuarioExiste) {
      return res.render("registro", {
        error: "Ese email ya esta registrado" // Evita registros duplicados.
      });
    }

    const { salt, passwordHash } = Usuario.crearPasswordSeguro(password); // Genera el salt y el hash seguro de la contraseña.

    await Usuario.create({
      nombre,
      email,
      passwordHash, // Guarda el hash en lugar de la contraseña real.
      salt // Guarda el salt utilizado para generar el hash.
    });

    res.redirect("/login"); // Redirige al login una vez registrado correctamente.

  } catch (error) {
    console.error('[registro]', error.name, error.code, error.codeName);
    res.render("registro", {
      error: "Error al registrar usuario" // Muestra un mensaje si ocurre un error inesperado.
    });
  }
};

const iniciarSesion = async (req, res) => {
  try {
    const { email, password } = req.body; // Obtiene email y contraseña ingresados.

    const usuario = await Usuario.findOne({ email }); // Busca el usuario por email.
    if (!usuario || !usuario.validarPassword(password)) {
      return res.render("login", {
        error: "Email o password incorrectos" // Verifica que las credenciales sean válidas.
      });
    }

    const sesionToken = crypto.randomBytes(32).toString("hex"); // Genera un token de sesión aleatorio y seguro.

    usuario.sesionToken = sesionToken; // Asocia el token al usuario.
    await usuario.save(); // Guarda el token en MongoDB.

    res.cookie("sesion", sesionToken, { // Envía el token al navegador mediante una cookie.
      httpOnly: true, // Impide que JavaScript acceda a la cookie.
      sameSite: "lax", // Ayuda a prevenir ataques CSRF.
      maxAge: 1000 * 60 * 60 // Duración de la sesión: 1 hora.
    });

    res.redirect("/proyecto"); // Redirige al área protegida.

  } catch (error) {
    res.render("login", {
      error: "Error al iniciar sesion" // Error inesperado durante el login.
    });
  }
};

const cerrarSesion = async (req, res) => {
  if (req.usuario) { // Verifica que exista un usuario autenticado.

    req.usuario.sesionToken = null; // Invalida la sesión en la base de datos.
    await req.usuario.save(); // Guarda el cambio.
  }

  res.clearCookie("sesion"); // Elimina la cookie del navegador.
  res.redirect("/login"); // Redirige al formulario de login.
};

module.exports = {
  mostrarLogin,
  mostrarRegistro,
  registrarUsuario,
  iniciarSesion,
  cerrarSesion
};