const { Router } = require('express');
const router = Router();

const UserController = require('../controllers/users.controller');
const userController = new UserController();

/*
 ***************************************************************
                        USERS ROUTES
 *******************************************************************
 */

/**
 * @swagger
 *
 * /login:
 *   post:
 *     description: Login to the application
 *     produces:
 *       - application/json
 *     parameters:
 *       - name: username
 *         description: Username to use for login.
 *         in: formData
 *         required: true
 *         type: string
 *       - name: password
 *         description: User's password.
 *         in: formData
 *         required: true
 *         type: string
 *     responses:
 *       200:
 *         description: login
 */

/* [TESTED] Obtener un usuario de la base de datos. */
router.get('/usuario/:userId', userController.getUser);

/* [TESTED] Obtener todos los usuarios */
router.get('/usuarios', userController.getUsers);

/* [TESTED] Obtener todos los usuarios que son laboratorio docente */
router.get('/usuarios/admin', userController.getAdmins);

/* [TESTED] Obtener todos los usuarios que son profesor o estudiante */
router.get('/usuarios/profesor', userController.getStandardUsers);

/* Registrar un nuevo usuario */
router.post('/signup', userController.signUp);

/* Inicio de sesion */
router.post('/signin', userController.signIn);

module.exports = router;
