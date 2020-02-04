const express = require('express');

const ReservacService = require('../services/reserva')

function reservACapi(app) {
    const router = express.Router();
    const reservacService = new ReservacService

    app.use("/api/", router);

    //  ************************ CRUD BASICO DE MODELO SOBRE ITEM *******************

    //  *** Mostrar todos los items   http://localhost:3000/api/items ***
    router.get("/items", async function (req, res, next) {
        try {
            const items = await reservacService.getItems()
            res.send(items.rows);
        } catch (err) {
            next(err);
        }
    });

    //  *** Mostrar un item por su ID   http://localhost:3000/api/items/<itemID> ***
    router.get("/items/:itemId", async function (req, res, next) {
        try {
            const id = req.params.itemId;
            const item = await reservacService.getItem(id);
            res.send(item.rows)
        } catch (err) {
            next(err);
        };
    });

    //  *** Crear un item:   http://localhost:3000/api/item ***
    router.post("/item", async function (req, res, next) {
        const name = req.body.name;
        const description = req.body.description;
        try {
            const createItem = await reservacService.createItem(name, description);
            res.send(201).json({
                message: 'Item Agregado',
                body: {
                    Item: { name }
                },
                body2: createItem
            })
        } catch (err) {
            next(err);
        }
    });

    //  *** Actualizar un item: http://localhost:3000/api/items/<itemID> ***
    router.put("/items/:itemId", async function (req, res, next) {
        const name = req.body.name;
        const id = req.params.itemId;
        const description = req.body.description;
        try {
            await reservacService.updateItem(id, name, description);
            res.send('Item actualizado');
        } catch (err) {
            next(err);
        };
    });

    //  *** Eliminar un item: http://localhost:3000/api/items/<itemId> ***
    router.delete("/items/:itemId", async function (req, res, next) {
        const id = req.params.itemId;
        await reservacService.deleteItem(id);
        try {
            res.send(`Item Id: ${id} Eliminado correctamente`);
        } catch (err) {
            next(err);
        };
    });

    //  ************************ API REST ENDPOINTS  ***********************

    //  *** Mostrar todas las salas   http://localhost:3000/api/salas ***
    router.get("/salas", async function (req, res, next) {
        try {
            const salas = await reservacService.getSalas()
            res.send(salas.rows);
        } catch (err) {
            next(err);
        }
    });

    //  *** Mostrar datos de una Sala   http://localhost:3000/api/salas/<salaId=MYS-022> ***
    router.get("/salas/:salaId", async function (req, res, next) {
        const { salaId } = req.params;
        try {
            const sala = await reservacService.getSala(salaId);
            res.send(sala.rows);
        } catch (err) {
            next(err);
        }
    });
}
module.exports = reservACapi;