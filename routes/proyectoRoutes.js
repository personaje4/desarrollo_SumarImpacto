import express from "express";

import {
  obtenerProyecto,
  obtenerProyectoPorId,
  crearProyecto,
  actualizarProyecto,
  eliminarProyecto
} from "../controllers/proyectoController.js";

const router = express.Router();

// RUTAS CRUD PARA PROYECTOS
router.get("/", obtenerProyecto);
router.get("/:id", obtenerProyectoPorId);
router.post("/", crearProyecto);
router.put("/:id", actualizarProyecto);
router.delete("/:id", eliminarProyecto);


export default router;