const express = require('express');

const ReservacService = require('../services/reserva')

function reservACapi(app) {
    const router = express.Router();
    const reservacService = new ReservacService

    app.use("/api/", router);

    /*
    */
    router.get("/items", async function (req, res, next) {
        const { name } = req.query;
        try {
            const items = await reservacService.getItems({ name })
            // console.log(items.rows);
            res.send(items.rows);
        } catch (err) {
            next(err);
        }
    });

    router.get("/items/:itemId", async function (req, res, next) {
        try {
            const id = req.params.itemId;
            const item = await reservacService.getItem(id);
            res.send(item.rows)
        } catch (err) {
            next(err);
        };
    });

    router.post("/item", async function (req, res, next) {
        const name = req.body.name;
        try {
            const createItem = await reservacService.createItem(name);
            res.json({
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

    router.put("/items/:itemId", async function (req, res, next) {
        const name = req.body.name;
        const id = req.params.itemId;
        try {
            const updatedItem = await reservacService.updateItem(id, name);
            // console.log(updatedItem);
            res.send('Item actualizado');
            res.send(updatedItem);
        } catch (err) {
            next(err);
        };
    });

    router.delete("/items/:itemId", async function (req, res, next) {
        const id = req.params.itemId;
        const deletedItem = await reservacService.deleteItem(id);
        try {
            // console.log(deletedItem);
            res.send(`Item Id: ${id} Eliminado correctamente`);
            res.send(deletedItem);
        } catch (err) {
            next(err);
        };
    });

    router.get("/:salaId", async function (req, res, next) {
        const { salaId } = req.params;
        try {
            const response = await reservacService.getItems({ salaId });
            // console.log(response.rows);
            res.status(200).send(response);
        } catch (err) {
            next(err);
        }
    });
}
module.exports = reservACapi;