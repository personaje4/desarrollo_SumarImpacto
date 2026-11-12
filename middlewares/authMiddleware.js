const usuario = require("../models/usuario");

const leerCookies = (req) => {
  const header = req.headers.cookie; // Obtiene todas las cookies enviadas por el navegador.

  if (!header) {
    return {}; // Si no hay cookies, devuelve un objeto vacío.
  }
  // Las cookies llegan como un texto y
  // necesitamos convertirlas en un objeto JavaScript para poder acceder fácilmente a ellas.
  return header.split(";").reduce((cookies, cookie) => {
    const [nombre, valor] = cookie.trim().split("="); // Separa nombre y valor de cada cookie.
    cookies[nombre] = decodeURIComponent(valor); // Guarda la cookie dentro del objeto.
    return cookies;
  }, {});
};

const protegerRuta = async (req, res, next) => { // Middleware que protege rutas privadas.
  const cookies = leerCookies(req); // Lee las cookies de la solicitud.
  const sesionToken = cookies.sesion; // Obtiene el token de sesión.

  if (!sesionToken) {
    return res.redirect("/login"); // Si no hay sesión, redirige al login.
  }

  const usuario = await usuario.findOne({ sesionToken }); // Busca el usuario asociado al token.

  if (!usuario) {
    res.clearCookie("sesion"); // Elimina la cookie inválida.
    return res.redirect("/login"); // Redirige al login si la sesión no existe.
  }

  req.usuario = usuario; // Guarda el usuario autenticado en la petición.
  res.locals.usuario = { nombre: usuario.nombre, rol: usuario.rol };
  next(); // Permite continuar hacia la ruta solicitada.
};

const soloAdmin = (req, res, next) => { // Middleware que exige rol admin (usar después de protegerRuta).
  if (req.usuario && req.usuario.rol === "admin") {
    return next();
  }

  return res.status(403).json({ mensaje: "No tenés permisos para realizar esta acción" });
};

module.exports = {
  protegerRuta,
  soloAdmin
};