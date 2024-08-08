const { conexion } = require("./basedatos/conexion");
const express = require("express");
const cors = require("cors");


//inicializar app
console.log("App de node arrancada");


//conectar a la base datos
conexion();

//Crear servidor Node
const app = express();
const puerto = 3900;

//configurar cors
app.use(cors());


//convertir body a objeto JS
app.use(express.json());

//crear Rutas

app.get("/probando", (req, res) => {
    console.log("se haejecutado el endpoint prrobando");

    return res.status(200).send({
        curso: "master en react",
        autor: "vicotr robles"
    });
});



//crear servidor y escuchar peticiones
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto"+puerto);
})

