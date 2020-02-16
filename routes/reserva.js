const express = require('express');
//const multer = require("multer");
//const fs = require('fs');
const path = require("path");
const ReservacService = require('../services/reserva');
const boom = require('@hapi/boom');

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
            await reservacService.createItem(name, description);
            res.sendStatus(201);
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
    //  *******************************************************************
    //  ************************ API REST ENDPOINTS ***********************
    //  **************************** SALAS ********************************

    //  *** Mostrar todas las salas http://localhost:3000/api/salas ***
    router.get("/salas", async function (req, res, next) {
        try {
            const salas = await reservacService.getSalas()
            res.send(salas.rows);
        } catch (err) {
            next(err);
        }
    });

    //  *** Mostrar datos de una Sala http://localhost:3000/api/salas/<salaId=MYS-022> ***
    router.get("/salas/:salaId", async function (req, res, next) {
        const { salaId } = req.params;
        try {
            const sala = await reservacService.getSala(salaId);
            res.send(sala.rows);
        } catch (err) {
            next(err);
        }
    });

    //  *** Mostrar items de una Sala http://localhost:3000/api/salas/<salaId>/items ***
    router.get("/salas/:salaId/items", async function (req, res, next) {
        const salaId = req.params.salaId;
        try {
            const salaItems = await reservacService.getSalaItems(salaId);
            res.send(salaItems.rows);
        } catch (err) {
            next(err);
        }
    });

    //  *** Obtener todas las salas que son administradas por un laboratorio ***
    router.get("/salas/admin/:userId", async function (req, res, next) {
        const userId = req.params.userId;
        try {
            const adminSalas = await reservacService.getAdminSalas(userId);
            res.send(adminSalas.rows);
        } catch (err) {
            next(err);
        }
    });

    // Obtener la imagen de una sala
    router.get("/salas/:salaId/picture", async function (req, res, next) {
        const salaId = req.params.salaId;
        try {
            res.sendFile(path.join((__dirname) + `/../media/${salaId}.jpg`),
                function (err) {
                    if (err) {
                        res.sendFile(path.join((__dirname) + `/../media/defaultImage.jpg`));
                    }
                }
            );
        } catch (err) {
            next(err);
        }
    });

    //  *** Actualizar una sala ***
    router.put("/salas/:salaId", async function (req, res, next) {
        const { name, description, is_active } = req.body;
        const id = req.params.salaId;
        try {
            await reservacService.updateSala(id, name, description, is_active);
            res.send('Sala actualizada');
        } catch (err) {
            next(err);
        };
    });

    //  **************************** SOLICITUDES ********************************


    //  Obtener informacion de una solicitud
    router.get("/solicitudes/:solicitudId", async function (req, res, next) {
        const solicitudId = req.params.solicitudId;
        try {
            const requestFromUser = await reservacService.getRequest(solicitudId);
            res.send(requestFromUser.rows);
        } catch (err) {
            next(err);
        }
    });

    //  Obtener todas las solicitudes hechas por un usuario
    router.get("/solicitudes/:userId", async function (req, res, next) {
        const userId = req.params.userId;
        try {
            const requestFromUser = await reservacService.getRequestUser(userId);
            res.send(requestFromUser.rows);
        } catch (err) {
            next(err);
        }
    });

    // Obtener todas las solicitudes correspondientes a un laboratorio.
    router.get("/solicitudes/admin/:labId", async function (req, res, next) {
        const labId = req.params.labId;
        try {
            const requestFromUser = await reservacService.getRequests(labId);
            res.send(requestFromUser.rows);
        } catch (err) {
            next(err);
        }
    });

    // Actualizar una solicitud por id = <request_id> .
    router.put("/solicitudes/:requestId", async function (req, res, next) {
        const id = req.params.requestId
        const { reason, status } = req.body;
        try {
            await reservacService.updateRequest(id, reason, status);
            res.send('Solicitud actualizada');
        } catch (err) {
            next(err);
        };
    });

    //  **************************** USUARIOS ********************************

    // Obtener un usuario de la base de datos.
    router.get("/usuario/:userId", async function (req, res, next) {
        const userId = req.params.userId;
        try {
            const requestFromUser = await reservacService.getUser(userId);
            if (requestFromUser.rows.length) {
                res.send(requestFromUser.rows);
            } else {
                res.json(boom.notFound('missing').output.payload);
            }
        } catch (err) {
            next(err);
        }
    });

    //  Obtener todos los usuarios
    router.get("/usuarios", async function (req, res, next) {
        try {
            const requestFromUser = await reservacService.getUsers();
            if (requestFromUser.rows.length) {
                res.send(requestFromUser.rows);
            } else {
                res.json(boom.notFound('missing').output.payload);
            }
        } catch (err) {
            next(err);
        }
    });

    // Obtener todos los usuarios que son laboratorio docente
    router.get("/usuarios/admin", async function (req, res, next) {
        try {
            const adminUsers = await reservacService.getAdminUsers();
            if (adminUsers.rows.length) {
                res.send(adminUsers.rows);
            } else {
                res.json(boom.notFound('missing').output.payload);
            }
        } catch (err) {
            next(err);
        }
    });

    // Obtener todos los usuarios que son profesor o estudiante
    router.get("/usuarios/profesor", async function (req, res, next) {
        try {
            const profesor = await reservacService.getProfesor();
            res.send(profesor.rows);
        } catch (err) {
            next(err);
        }
    });

    //  **************************** MATERIAS ********************************

    // Obtener todas las materias
    router.get("/subjects", async function (req, res, next) {
        try {
            const subjects = await reservacService.getSubjects();
            res.send(subjects.rows);
        } catch (err) {
            next(err);
        }
    });

}
module.exports = reservACapi;