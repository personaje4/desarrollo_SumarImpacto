const express = require("express");
const app = express();
const PORT = 3000;

const proyectoRoutes = require("./routes/proyectoRoutes");
const donanteCorporativoRoutes = require("./routes/donanteCorporativoRoutes");

app.use(express.json());

// usar rutas
app.use("/proyecto", proyectoRoutes);
app.use("/donanteCorporativo", donanteCorporativoRoutes);

app.listen(PORT , () => {
    console.log("Servidor corriendo en puerto " + PORT);
});
