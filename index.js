const express = require("express");
const app = express();
const PORT = 3000;

const proyectoRoutes = require("./routes/proyectoRoutes");
const donanteCorporativoRoutes = require("./routes/donanteCorporativoRoutes");

app.use(express.json());

// Middleware para procesar JSON y formularios HTML
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Configurar motor de plantillas Pug
app.set("view engine", "pug");
app.set("views", "./views");

// Ruta principal del sitio (Inicio)
app.get("/", (req, res) => {
  res.render("index");
});

// usar rutas agrupadas
app.use("/proyecto", proyectoRoutes);
app.use("/donanteCorporativo", donanteCorporativoRoutes);

app.listen(PORT , () => {
    console.log("Servidor corriendo en puerto " + PORT);
});
