const { Router } = require('express');
const router = Router()

const ItemController = require('../controllers/items.controller');
const itemController = new ItemController;

/*
    ***************************************************************
                            ITEMS ROUTES
    *******************************************************************
*/

/* [TESTED] Mostrar todos los items en el sistema */
router.get("/items", itemController.allItems);

/* [TESTED] Mostrar un item por su ID */
router.get("/items/:itemId", itemController.specificItem);

/* [TESTED] Crear un item */
router.post("/item", itemController.createItem);

/* [TESTED] Actualizar un item */
router.put("/items/:itemId", itemController.updateItem);

/* [TESTED] Eliminar un item */
router.delete("/items/:itemId", itemController.deleteItem);

module.exports = router;
