const validator = require("validator");
const Articulo = require("../modelos/Articulo");

const prueba = (req, res) => {
    return res.status(200).json({
        mensaje: "Soy una acción de prueba de controlador de artículos"
    });
}

const curso = (req, res) => {
    console.log("Se ha ejecutado el endpoint probando");

    return res.status(200).send([
        {
            curso: "Master en React",
            autor: "Víctor Robles"
        },
        {
            curso: "Master en React",
            autor: "Víctor Robles"
        },
    ]);
};

const crear = async (req, res) => {
    // Recoger datos de POST a guardar
    let parametros = req.body;

    // Validar datos
    try {
        let validar_titulo = !validator.isEmpty(parametros.titulo) &&
                             validator.isLength(parametros.titulo, { min: 5, max: undefined });
        let validar_contenido = !validator.isEmpty(parametros.contenido);

        if (!validar_titulo || !validar_contenido) {
            throw new Error("No se ha validado la información");
        }
    } catch (error) {
        return res.status(400).json({
            status: "error",
            mensaje: "Faltan datos por enviar"
        });
    }

    try {
        // Crear objeto a guardar
        const articulo = new Articulo(parametros);

        // Guardar artículo en base de datos
        const articuloGuardado = await articulo.save();

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            articulo: articuloGuardado,
            mensaje: "Artículo creado con éxito"
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "No se ha podido guardar el artículo"
        });
    }
}



const listar = async (req, res) => {
    try {
        // Ejecuta la consulta usando await y ordena por fecha descendente
        let consulta = Articulo.find({});

        consulta.limit
                                
        consulta.sort({ fecha: -1 });



        const articulos = await consulta;

        // Verifica si se encontraron artículos
        if (!articulos.length) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha podido conseguir los artículos"
            });
        }

        // Si se encontraron artículos, responde con éxito
        return res.status(200).json({
            status: "success",
            articulos
        });

    } catch (error) {
        // Manejo de errores en la consulta
        return res.status(500).json({
            status: "error",
            mensaje: "Ocurrió un error al obtener los artículos"
        });
    }
};


module.exports = {
    prueba,
    curso,
    crear,
    listar
}
