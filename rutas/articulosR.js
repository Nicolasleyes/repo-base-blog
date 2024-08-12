 const express = require("express");
 const router = express.Router();

 const ArticuloControlador = require("../controladores/articuloC");

 // rutas de pruebas

router.get("/ruta-de-prueba", ArticuloControlador.prueba);


router.get("/curso", ArticuloControlador.curso);



 module.exports = router;