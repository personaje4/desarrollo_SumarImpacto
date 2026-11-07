const mongoose = require("mongoose");
const crypto = require("crypto");
require("dotenv").config();

const Usuario = require("./models/Usuario");

async function resetAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log("Conectado a MongoDB");

    const nuevaPassword = "Admin2026!";

    const salt = crypto.randomBytes(16).toString("hex");

    const passwordHash = crypto
      .pbkdf2Sync(nuevaPassword, salt, 10000, 64, "sha512")
      .toString("hex");

    const resultado = await Usuario.updateOne(
      { email: "admin@sumarimpacto.com" },
      {
        $set: {
          salt,
          passwordHash,
          updatedAt: new Date()
        }
      }
    );

    console.log("Resultado:", resultado.modifiedCount);

  } catch (error) {
    console.error("Error:", error);
  } finally {
    await mongoose.disconnect();
  }
}

resetAdmin();