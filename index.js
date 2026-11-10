require('dotenv').config({ path: require('path').join(__dirname, '.env') });
const express = require("express");
const conectarDB = require('./config/database');
const app = express();
const PORT = process.env.PORT || 3000;

const proyectoRoutes = require("./routes/proyectoRoutes");
const donanteCorporativoRoutes = require("./routes/donanteCorporativoRoutes");

// Importar tus middlewares de error
const { 
  capturarJsonInvalido, 
  rutaNoEncontrada, 
  manejadorErrores 
} = require("./middlewares/errorMiddleware");


// Middleware para procesar JSON y formularios HTML
app.use(express.json());
app.use(capturarJsonInvalido);
app.use(express.urlencoded({ extended: true }));

// Configurar motor de plantillas Pug
app.set("view engine", "pug");
app.set("views", require('path').join(__dirname, 'views'));

// Ruta principal del sitio (Inicio)
app.get("/", (req, res) => {
  res.render("index");
});

// usar rutas agrupadas
app.use("/proyecto", proyectoRoutes);
app.use("/donanteCorporativo", donanteCorporativoRoutes);
app.use("/donantes-corporativos", donanteCorporativoRoutes);

// 5. Middleware de rutas inexistentes (404)
app.use(rutaNoEncontrada);

// 6. Middleware centralizado de errores (500, 400, 409)
app.use(manejadorErrores);

async function iniciarServidor() {
  try {
    await conectarDB();
    app.listen(PORT, () => {
      console.log('Servidor disponible en http://localhost:' + PORT);
    }).on('error', (error) => {
      console.error('No se pudo iniciar el servidor:', error.message);
      require('mongoose').disconnect().finally(() => { process.exitCode = 1; });
    });
  } catch (error) {
    console.error('No se pudo iniciar la aplicación:', error.message);
    process.exitCode = 1;
  }
}

if (require.main === module) iniciarServidor();

module.exports = app;
