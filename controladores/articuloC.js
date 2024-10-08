const fs = require("fs");
const path = require("path");
const { validarArticulo } = require("../helper/validar");
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

//metodo de crear

const crear = async (req, res) => {
    // Recoger datos de POST a guardar
    let parametros = req.body;

    // Validar datos

    try {
        validarArticulo(parametros);

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


//metodo para enlistar 

const listar = async (req, res) => {
    try {
        // Ejecuta la consulta usando await y ordena por fecha descendente
        let consulta = Articulo.find({});

        if (req.params.ultimos) {
            consulta.limit(3);
        }

        consulta.sort({ fecha: -1 });

        const articulos = await consulta;

        // Verifica si se encontraron artículos
        if (!articulos.length) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se ha podido conseguir los artículos"
            });
        }

        // Si quieres retrasar la respuesta, usa setTimeout aquí
        setTimeout(() => {
            return res.status(200).json({
                status: "success",
                contador: articulos.length,
                articulos
            });
        }, 250); // Retraso de 2 segundos

    } catch (error) {
        // Manejo de errores en la consulta
        return res.status(500).json({
            status: "error",
            mensaje: "Ocurrió un error al obtener los artículos"
        });
    }
};



//metodo paraencontrar articulo por id


const uno = async (req, res) => {
    try {
        // Recoger un id por la URL
        let id = req.params.id;

        // Buscar el artículo
        const articulo = await Articulo.findById(id);

        // Si no existe, devolver error


        // Si existe, devolver resultado
        return res.status(200).json({
            status: "success",
            articulo
        });
    } catch (error) {
        // Manejar error si la búsqueda falla
        return res.status(500).json({
            status: "error",
            mensaje: "Error al buscar el artículo",
            error: error.message
        });
    }
};

//metodo para borrar

const borrar = async (req, res) => {
    try {
        let articuloId = req.params.id;

        // Encuentra y borra el artículo
        const articuloBorrado = await Articulo.findByIdAndDelete(articuloId);



        return res.status(200).json({
            status: "success",
            articulo: articuloBorrado,
            mensaje: "Artículo borrado con éxito"
        });
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al borrar el artículo"
        });
    }
};


const editar = async (req, res) => {
    try {
        // Recoger el id del artículo a editar
        let articuloId = req.params.id;

        // Recoger datos del body
        let parametros = req.body;

        // Validar datos
        try {
            validarArticulo(parametros);

        } catch (error) {
            return res.status(400).json({
                status: "error",
                mensaje: "Faltan datos por enviar"
            });
        }


        // Buscar y actualizar artículo
        const articuloActualizado = await Articulo.findOneAndUpdate(
            { _id: articuloId },
            parametros,
            { new: true }
        );

        if (!articuloActualizado) {
            return res.status(404).json({
                status: "error",
                mensaje: "No se encontró el artículo para actualizar"
            });
        }

        // Devolver respuesta
        return res.status(200).json({
            status: "success",
            articulo: articuloActualizado
        });

    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al actualizar: " + error.message
        });
    }
};


//metodo para subir imagen


const subir = async (req, res) => {
    try {
        // Recoger el fichero de imagen subida
        if (!req.file && !req.files) {
            return res.status(404).json({
                status: "error",
                mensaje: "Petición inválida"
            });
        }

        // Conseguir el nombre de la imagen
        let archivo = req.file.originalname;

        // Extensión de archivo
        let archivoSplit = archivo.split(".");
        let extension = archivoSplit[archivoSplit.length - 1].toLowerCase();

        // Comprobar extensión correcta
        if (extension != "png" && extension != "jpg" &&
            extension != "jpeg" && extension != "gif") {

            // Borrar archivo y dar respuesta
            fs.unlink(req.file.path, (error) => {
                return res.status(400).json({
                    status: "error",
                    mensaje: "Archivo inválido"
                });
            });
        } else {
            // Si todo va bien, actualizar el artículo
            let articuloId = req.params.id;

            // Buscar y actualizar artículo
            const articuloActualizado = await Articulo.findOneAndUpdate(
                { _id: articuloId },
                { imagen: req.file.filename },
                { new: true }
            );

            if (!articuloActualizado) {
                return res.status(404).json({
                    status: "error",
                    mensaje: "No se encontró el artículo para actualizar"
                });
            }

            // Devolver respuesta
            return res.status(200).json({
                status: "success",
                articulo: articuloActualizado,
                fichero: req.file
            });
        }
    } catch (error) {
        return res.status(500).json({
            status: "error",
            mensaje: "Error al actualizar el artículo: " + error.message
        });
    }
};



//

const imagen = (req, res) => {

    let fichero = req.params.fichero;

    let ruta_fisica = "./imagenes/articulos/" + fichero;

    fs.stat(ruta_fisica, (error, existe) => {
        if (existe) {
            return res.sendFile(path.resolve(ruta_fisica));
        } else {
            return res.status(404).json({
                status: "error",
                mensaje: "la imagen no existe"
            })
        }
    })
}


const buscador = async (req, res) => {

    try {

        // Sacar el string de búsqueda
        let busqueda = req.params.busqueda;

        // Find OR 
        let articuloBuscado = await Articulo.find({
            "$or": [
                { "titulo": { "$regex": busqueda, "$options": "i" } },
                { "contenido": { "$regex": busqueda, "$options": "i" } }
            ]
        }).sort({ fecha: -1 });

        if(articuloBuscado.length === 0){
            throw new error("no se ha encontrado  articulos");
        }

        // Devolver resultado
        return res.status(200).json({
            status: "success",
            articulos: articuloBuscado
        });

    } catch (error) {

        return res.status(404).json({
            status: "error",
            mensaje: error.message || "No se han encontrado artículos"
        });

    }

}




//modulo para exportar metodos 

module.exports = {
    prueba,
    curso,
    crear,
    listar,
    uno,
    borrar,
    editar,
    subir,
    imagen,
    buscador
}
