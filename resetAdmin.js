const mongoose = require("mongoose");
const crypto = require("crypto");
require("dotenv").config();

const Usuario = require("./models/Usuario");

async function resetAdmin() {
  try {
    // Lee MONGODB_URI de tu .env o usa por defecto la conexión local
    const uri = process.env.MONGODB_URI || process.env.MONGO_URI || "mongodb://127.0.0.1:27017/sumarimpacto";
    await mongoose.connect(uri);
    console.log("Conectado a MongoDB");

    const email = "admin@sumarimpacto.com";
    const nuevaPassword = "Admin2026!";

    const salt = crypto.randomBytes(16).toString("hex");

    const passwordHash = crypto
      .pbkdf2Sync(nuevaPassword, salt, 10000, 64, "sha512")
      .toString("hex");

    const resultado = await Usuario.updateOne(
      { email },
      {
        $set: {
          nombre: "Administrador",
          email,
          rol: "admin",
          salt,
          passwordHash,
          updatedAt: new Date()
        }
      },
      { upsert: true } // Si el usuario no existe en la base, lo crea automáticamente
    );

    console.log("Operación completada con éxito.");
    console.log("Usuario administrador configurado:", email);

  } catch (error) {
    console.error("Error al configurar admin:", error);
  } finally {
    await mongoose.disconnect();
  }
}

resetAdmin();