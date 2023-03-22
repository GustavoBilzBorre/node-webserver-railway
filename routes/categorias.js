const { Router } = require('express');
const { check } = require('express-validator');
const { validarJWT, validarCampos } = require('../middlewares');
const { crearCategoria, obtenerCategorias, obtenerCategoria, actualizarCategoria, eliminarCategoria } = require('../controllers/categorias');
const { existeCategoriaPorId } = require('../helpers/db-validators')

const router = Router();

router.get('/', obtenerCategorias);

router.get('/:id', [check('id').custom(existeCategoriaPorId),
    validarCampos
], obtenerCategoria);

router.post('/', [validarJWT, check('nombre', 'El campo nombre es obligatorio').not().isEmpty(), validarCampos], crearCategoria);

router.put('/:id', [validarJWT,
    check('nombre', 'El campo nombre es obligatorio').not().isEmpty(),
    check('id').custom(existeCategoriaPorId),
    validarCampos
], actualizarCategoria);

router.delete('/:id', [validarJWT,
    check('id').custom(existeCategoriaPorId),
    validarCampos
], eliminarCategoria);

module.exports = router;