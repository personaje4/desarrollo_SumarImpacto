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

app.use(express.json()); // Middleware para JSON

// Middleware para formularios HTML
app.use(express.urlencoded({ extended: true }));

app.use(express.static("public")); // Archivos estáticos

// Motor de vistas Pug
app.set("view engine", "pug");
app.set("views", "./views");

app.get("/", (req, res) => {
    res.redirect("/login");
});

app.use("/", authRoutes);
app.use("/proyecto", protegerRuta, proyectoRoutes);
app.use("/donantes-corporativos", protegerRuta, donanteCorporativoRoutes);

async function iniciar() {
    await conectarDB(); // Si falla, conectarDB hace process.exit(1)

    app.listen(PORT, () => {
        console.log("Servidor corriendo en puerto " + PORT);
    });
}

iniciar();