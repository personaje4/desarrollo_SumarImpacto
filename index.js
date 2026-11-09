const express = require("express");
const dotenv = require("dotenv");
const { conectarDB } = require("./config/db");
const authRoutes = require("./routes/authRoutes");
const proyectoRoutes = require("./routes/proyectoRoutes");
const donanteCorporativoRoutes = require("./routes/donanteCorporativoRoutes");
const { protegerRuta } = require("./middlewares/authMiddleware");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

// Middlewares para procesar JSON y formularios HTML
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos
app.use(express.static("public"));

// Configuración del motor de vistas Pug
app.set("view engine", "pug");
app.set("views", "./views");

// Ruta raíz: si está autenticado muestra la pantalla de inicio; si no, protege y redirige al login
app.get("/", protegerRuta, (req, res) => {
  res.render("index");
});

// Rutas de autenticación (login, registro, logout)
app.use("/", authRoutes);

// Rutas protegidas de los módulos principales
app.use("/proyecto", protegerRuta, proyectoRoutes);
app.use("/donantes-corporativos", protegerRuta, donanteCorporativoRoutes);

async function iniciar() {
  await conectarDB();

  app.listen(PORT, () => {
    console.log("Servidor corriendo en puerto " + PORT);
  });
}

iniciar();