
const prueba = (req,res) =>{
    
    return res.status(200).json({
        mensaje: "Soy una accion de prueba de controlador de articulos"
    });
}


const curso = (req, res) => {
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
};





module.exports = {
    prueba,
    curso
}