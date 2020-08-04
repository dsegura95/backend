const { Router } = require('express');
const router = Router();

const SalaController = require('../controllers/salas.controller');
const salasController = new SalaController();

/*
 ***************************************************************
                            ROOMS ROUTES
 *******************************************************************
*/

/* [TESTED] Mostrar todas las salas existentes */
router.get('/salas', salasController.allRooms);

/* [TESTED] Mostrar datos de una Sala */
router.get('/salas/:salaId', salasController.specificRoom);

/* [TESTED] Mostrar los items que posee una sala */
router.get('/salas/:salaId/items', salasController.getRoomItems);

/* [TESTED] Mostrar todos los items menos los de que ya posee una sala */
router.get('/not/items/:roomId', salasController.itemsNoOwned);

/* [TESTED] Obtener todas las salas que son administradas por un laboratorio */
router.get('/salas/admin/:userId', salasController.adminRooms);

/* [TESTED] Obtener la imagen de una sala */
router.get('/salas/:salaId/picture', salasController.getImageRoom);

/* [TESTED] Eliminar un item de una sala en el trimestre actual */
router.delete('/salas/:salaId/:itemId', salasController.deleteRoomItem);

/* [TESTED] Actualizar la cantidad de un item de una sala en el trimestre actual */
router.put('/salas/:salaId/:itemId', salasController.updateRoomItems);

/* [TESTED] Actualizar descripcion nombre y status de una sala */
router.put('/salas/:salaId', salasController.updateRoom);

/* [TESTED] Crear una nueva sala */
router.post('/salas/crear', salasController.createRoom);

/* [TESTED] Agregar un item a la sala para el trimestre actual */
router.post('/salas/:salaId/:itemId', salasController.addRoomItem);

/* Subir una nueva imagen */
router.post('/salas/:salaId/picture/new', salasController.uploadRoomImage);

module.exports = router;
