const { response } = require("express");
const { ObjectId } = require("mongoose").Types;
const { Categoria, Producto, Usuario } = require('../models')

const coleccionesPermitidas = [
    'categorias',
    'productos',
    'roles',
    'usuarios'
]

const buscarUsuarios = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);
    if (esMongoId) {
        const usuario = await Usuario.findById(termino);
        return res.json({
            results: usuario ? [usuario] : []
        });
    } else {
        const regex = RegExp(termino, 'i');
        const usuarios = await Usuario.find({
            $or: [{ nombre: regex }, { correo: regex }],
            $and: [{ estado: true }]
        });
        return res.json({
            results: usuarios
        })
    }
}

const buscarProductos = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);
    if (esMongoId) {
        const producto = await Producto.findById(termino).populate('categoria', 'nombre');
        return res.json({
            results: producto ? [producto] : []
        });
    } else {
        const regex = RegExp(termino, 'i');
        const productos = await Producto.find({
            $or: [{ nombre: regex }, { descripcion: regex }],
            $and: [{ estado: true }]
        }).populate('categoria', 'nombre');
        return res.json({
            results: productos
        })
    }
}

const buscarCategorias = async(termino = '', res = response) => {
    const esMongoId = ObjectId.isValid(termino);
    if (esMongoId) {
        const categoria = await Categoria.findById(termino);
        return res.json({
            results: categoria ? [categoria] : []
        });
    } else {
        const regex = RegExp(termino, 'i');
        const categorias = await Categoria.find({ nombre: regex }, { estado: true });
        return res.json({
            results: categorias
        })
    }
}

const buscar = (req, res = response) => {
    const { coleccion, termino } = req.params;
    if (!coleccionesPermitidas.includes(coleccion)) return res.status(400).json({ msg: `Las colecciones permitidas son:${coleccionesPermitidas}` });
    switch (coleccion) {
        case 'categorias':
            buscarCategorias(termino, res);
            break;
        case 'productos':
            buscarProductos(termino, res);
            break;
        case 'usuarios':
            buscarUsuarios(termino, res);
            break;
        default:
            res.status(500).json({ msg: 'Se le olvido hacer esta búsqueda' })
    }
}

module.exports = { buscar }