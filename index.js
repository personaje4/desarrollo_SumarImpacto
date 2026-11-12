const express = require("express");
const dotenv = require("dotenv");
const conectarDB = require("./config/database");
const authRoutes = require("./routes/authRoutes");
const proyectoRoutes = require("./routes/proyectoRoutes");
const donanteCorporativoRoutes = require("./routes/donanteCorporativoRoutes");
const { protegerRuta } = require("./middlewares/authMiddleware");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 3000;

app.use(express.json()); // Middleware para JSON

// Middleware para formularios HTML
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public")); // Archivos estáticos

// Motor de vistas Pug
app.set("view engine", "pug");
app.set("views", "./views");

app.get("/", protegerRuta, (req, res) => {
    res.render("index");
});

app.use("/", authRoutes);
app.use("/proyecto", protegerRuta, proyectoRoutes);
app.use("/donantes-corporativos", protegerRuta, donanteCorporativoRoutes);

async function iniciar() {
    await conectarDB(); 

    app.listen(PORT, () => {
        console.log("Servidor corriendo en puerto " + PORT);
    });
}

if (require.main === module) {
  iniciar().catch((error) => {
    console.error("No se pudo iniciar la aplicación:", error.message);
    process.exitCode = 1;
  });
}

module.exports = app;