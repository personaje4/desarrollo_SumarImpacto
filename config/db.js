const mongoose = require("mongoose");

const conectarDB = async () => {
  try {
    // Acepta MONGO_URI, MONGODB_URI o conecta por defecto a la base local
    const uri = process.env.MONGO_URI || process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/sumarimpacto";
    await mongoose.connect(uri);
    console.log("MongoDB conectado");
  } catch (error) {
    console.error("Error al conectar a MongoDB:", error);
    process.exit(1);
  }
};

module.exports = { conectarDB };