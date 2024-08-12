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


// rutas

const rutas_articulo = require("./rutas/articulosR");

//cargar las rutas

app.use("/api", rutas_articulo );

console.log(typeof rutas_articulo);

//rutas hrcodeadas



app.get("/probando", (req, res) => {
    console.log("se haejecutado el endpoint prrobando");

    return res.status(200).send([
        {
            curso: "master en react",
            autor: "vicotr robles"
        },
        {
            curso: "master en react",
            autor: "vicotr robles"
        },

    ]);
});

app.get("/", (req, res) => {
    console.log("se haejecutado el endpoint prrobando");

    return res.status(200).send(
        "<h1>haciendo api con node</h1>"
    );
});




//crear servidor y escuchar peticiones
app.listen(puerto, () => {
    console.log("Servidor corriendo en el puerto"+puerto);
})

