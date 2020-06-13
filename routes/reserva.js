const express = require('express');
const fs = require('fs');
const path = require("path");
const ReservacService = require('../services/reserva');
const boom = require('@hapi/boom');
//const Auth= require('../authentication/auth.js');

function reservACapi(app) {
    const router = express.Router();
    const reservacService = new ReservacService;
   // const auth = new Auth;

    app.use("/api/", router);
    //////////////////////////////////////////////////////////////////
    const moment = require('moment');

    router.get("/actualizarTrimestre", async function (req, res, next) {

        const temp = await reservacService.getActualTrim();
        const lasTrim = (temp.rows[0].finish).toISOString().substring(0, 10);

        try {
            if (!(moment().isAfter(moment(lasTrim).add(1, 'day')))) {
                const lasTrimMonth = moment(lasTrim).month();
                const lasTrimYear = moment(lasTrim).year();

                if ((2 <= lasTrimMonth) && (lasTrimMonth <= 4)) {
                    await reservacService.createTrim('ABR-JUL' + lasTrimYear,
                        moment(lasTrim).add(2, 'week').add(3, 'day').toISOString().substring(0, 10),
                        moment(lasTrim).add(2, 'week').add(3, 'day').add(3, 'month').toISOString().substring(0, 10),
                    )
                }
                else if ((5 <= lasTrimMonth) && (lasTrimMonth <= 9)) {
                    await reservacService.createTrim('SEP-DIC' + lasTrimYear,
                        moment(lasTrim).add(2, 'week').add(3, 'day'),
                        moment(lasTrim).add(2, 'week').add(3, 'day').add(3, 'month'),
                    )
                }
                else if ((10 <= lasTrimMonth)) {
                    await reservacService.createTrim('ENE-MAR' + moment(lasTrim).add(1, 'year').year(),
                        moment(lasTrim).add(1, 'week').add(3, 'day'),
                        moment(lasTrim).add(1, 'week').add(3, 'day').add(3, 'month'),
                    )
                }
                else {
                    await reservacService.createTrim('ENE-MAR' + lasTrimYear,
                        (moment(lasTrim).add(1, 'week').add(3, 'day')).toISOString().substring(0, 10),
                        (moment(lasTrim).add(1, 'week').add(3, 'day').add(3, 'month')).toISOString().substring(0, 10),
                    )
                }
                res.json('el trimestre termino bicho')
            } else {
                res.json('el trimestre no ha terminado bicho')
            }
        } catch (err) {
            next(err);
        }

    });

    //  **************************** TRIMESTRE ********************************

    router.get("/trimestre/ultimo", async function (req, res, next) {
        try {
            const trimestreUltimo = await reservacService.getActualTrim()
            res.status(200).send(trimestreUltimo.rows);
        } catch (err) {
            next(err);
        }
    });

    router.put("/trimestre/:Id", async function (req, res, next) {
        const { start, finish } = req.body;
        if (!start && !finish) {
            res.json(boom.badRequest('invalid query').output.payload);
        }
        const idParam = req.params.Id;
        try {
            const response = await reservacService.updateTrim(idParam, start, finish);
            if (!response){
                res.status(403).json({message: 'Fecha Invalida'});
            }
            else{
                res.status(200).json({message: 'Trimestre actualizado'});
            }
        } catch (err) {
            next(err);
        };
    });

    ////////////////////////////////////////////////////////////////

    //  ************************ CRUD BASICO DE MODELO SOBRE ITEM *******************

    //  *** Mostrar todos los items   http://localhost:3000/api/items ***
    router.get("/items", async function (req, res, next) {
        try {
            
            const items = await reservacService.getItems()
            res.status(200).send(items.rows);

        } catch (err) {
            next(err);
        }
    });

    //  *** Mostrar un item por su ID   http://localhost:3000/api/items/<itemID> ***
    router.get("/items/:itemId", async function (req, res, next) {
        try {
            const id = req.params.itemId;
           
            const item = await reservacService.getItem(id);
            res.status(200).send(item.rows)
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
            res.status(201).json({message : `Item ${name} creado`});
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
            res.status(200).json({message: `Item ${id} actualizado`});
        } catch (err) {
            next(err);
        };
    });

    //  *** Eliminar un item: http://localhost:3000/api/items/<itemId> ***
    router.delete("/items/:itemId", async function (req, res, next) {
        const id = req.params.itemId;
        await reservacService.deleteItem(id);
        try {

            res.status(200).send(`Item Id: ${id} Eliminado correctamente`);
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
            res.status(200).send(salas.rows);
        } catch (err) {
            next(err);
        }
    });

    //  *** Mostrar datos de una Sala http://localhost:3000/api/salas/<salaId=MYS-022> ***
    router.get("/salas/:salaId", async function (req, res, next) {
        const { salaId } = req.params;
        try {
            const sala = await reservacService.getSala(salaId);
            res.status(200).send(sala.rows);
        } catch (err) {
            next(err);
        }
    });

    //  **************************** ITEMS DE SALA ********************************

    //  *** Mostrar items de una Sala http://localhost:3000/api/salas/<salaId>/items ***
    router.get("/salas/:salaId/items", async function (req, res, next) {
        const salaId = req.params.salaId;
        try {
            const salaItems = await reservacService.getSalaItems(salaId);
            res.status(200).send(salaItems.rows);
        } catch (err) {
            next(err);
        }
    });

    //  Mostrar todos los items menos los de que ya posee una sala
    router.get("/not/items/:roomId", async function (req, res, next) {
        const roomId = req.params.roomId
        try {
            const itemsNoOwned = await reservacService.getItemsNoOwned(roomId)
            res.status(200).send(itemsNoOwned.rows);
        } catch (err) {
            next(err);
        }
    });

    //  *** Eliminar un item de una sala en el trimestre actual ***
    router.delete("/salas/:salaId/:itemId", async function (req, res, next) {
        const id = req.params.itemId;
        const salaId = req.params.salaId;
        try {
            await reservacService.deleteSalaItem(id, salaId);
            const salaItems = await reservacService.getSalaItems(salaId);
            res.status(200).send(salaItems.rows);
        } catch (err) {
            next(err);
        };
    });

    //  *** Actualizar la cantidad de un item de una sala en el trimestre actual ***
    router.put("/salas/:salaId/:itemId", async function (req, res, next) {
        const { quantity } = req.body;
        const room_id = req.params.salaId;
        const item_id = req.params.itemId;
        try {
            await reservacService.updateSalaItem(room_id, item_id, quantity);
            res.status(200).json({message: `Item ${item_id} actualizado en Sala ${room_id}`});
        } catch (err) {
            next(err);
        };
    });

    //  *** Asignar un item a la sala para el trimestre actual ***
    router.post("/salas/:salaId/:itemId", async function (req, res, next) {
        const { quantity } = req.body;
        const room_id = req.params.salaId;
        const item_id = req.params.itemId;
        try {
            await reservacService.createSalaItem(room_id, item_id, quantity);
            res.status(200).json({message : `${quantity} Item ${item_id} Asignado a Sala ${room_id}`});
        } catch (err) {
            next(err);
        };
    });

///////////////////////////////////////////////////////////////////////////////////////////

    //  *** Obtener todas las salas que son administradas por un laboratorio ***
    router.get("/salas/admin/:userId", async function (req, res, next) {
        const userId = req.params.userId;
        try {
            const adminSalas = await reservacService.getAdminSalas(userId);
            res.status(200).send(adminSalas.rows);
        } catch (err) {
            next(err);
        }
    });

    // Obtener la imagen de una sala
    router.get("/salas/:salaId/picture", async function (req, res, next) {
        const salaId = req.params.salaId;
        try {
            res.status(200).sendFile(path.join((__dirname) + `/../media/${salaId}.jpg`),
                function (err) {
                    if (err) {
                        res.status(200).sendFile(path.join((__dirname) + `/../media/defaultImage.jpg`));
                    }
                }
            );
        } catch (err) {
            next(err);
        }
    });

    router.post("/salas/:salaId/picture/new", async function (req, res, next) {
        try {
            const salaId = req.params.salaId;
            const { picture } = req.body;
            let base64String = picture; // Not a real image
            // Remove header
            let base64Image = base64String.split(';base64,').pop();
            fs.writeFile(path.join((__dirname) + `/../media/${salaId}.jpg`), base64Image, {encoding: 'base64'}, function() {
                res.status(201).json({ message: `Imagen de ${salaId} Actualizada`});
            });
        } catch (err) {
            next(err);
        };
    });

    //  *** Actualizar descripcion nombre y status de una sala ***
    router.put("/salas/:salaId", async function (req, res, next) {
        const { name, description, is_active } = req.body;
        const id = req.params.salaId;
        try {
            let change = await reservacService.updateSala(id, name, description, is_active);
            if (change == 1){
                res.status(200).json({ message: 'Sala Actualizada'});
            }
            else if (change == 0) {
                res.status(403).json({ error: 'Update Invalido'});
            }
            else if (change == -1){
                res.status(403).json({ error: 'Hay reservas asignadas a esta sala'});
            }
        } catch (err) {
            next(err);
        };
    });

    // Crear Sala
    router.post("/salas/crear", async function (req, res, next) {

        
        const {id ,name,owner_id,manager_id, is_active , description, first_used} = req.body;

        try {
            await reservacService.createSala(id, name, owner_id, manager_id, is_active, description, first_used);
            res.status(201).json({ message: `Sala ${id} Creada`});
        } catch (err) {
            next(err);
        };
    });

    //  **************************** RESERVAS ********************************

    //  *** Mostrar las horas reservadas de todas las semanas para una sala en el trim actual ***
    router.get("/reservas/:salaId/semana/todas", async function (req, res, next) {
        const salaId = req.params.salaId;
        try {
            const salaHorasOcupadas = await reservacService.getSalaHorasOcupadasTodas(salaId);
            res.status(200).send(salaHorasOcupadas.rows);
        } catch (err) {
            next(err);
        }
    });

    //  *** Mostrar las horas reservadas de las semanas pares para una sala en el trim actual ***
    router.get("/reservas/:salaId/semana/pares", async function (req, res, next) {
        const salaId = req.params.salaId;
        try {
            const salaHorasOcupadas = await reservacService.getSalaHorasOcupadasPares(salaId);
            res.status(200).send(salaHorasOcupadas.rows);
        } catch (err) {
            next(err);
        }
    });

    //  *** Mostrar las horas reservadas de las semanas impares para una sala en el trim actual ***
    router.get("/reservas/:salaId/semana/impares", async function (req, res, next) {
        const salaId = req.params.salaId;
        try {
            const salaHorasOcupadas = await reservacService.getSalaHorasOcupadasImpares(salaId);
            res.status(200).send(salaHorasOcupadas.rows);
        } catch (err) {
            next(err);
        }
    });

    //  Obtener todas las reservas de una sala
    router.get("/reservas/:roomId", async function (req, res, next) {
        const room = req.params.roomId;
        try {
            const reservationsRoom = await reservacService.getReservationByRoom(room);
            res.json(reservationsRoom.rows);
        } catch (err) {
            next(err);
        }
    });

    //  Obtener todas las reservas de una semana y su horario
    router.get("/reservas/:roomId/semana/:week", async function (req, res, next) {
        const week = req.params.week;
        const room = req.params.roomId;
        try {
            const reservationsOnWeek = await reservacService.getReservationFromWeek(room, week);
            res.json(reservationsOnWeek.rows);
        } catch (err) {
            next(err);
        }
    });

    //  Obtener el horario de una reserva
    router.get("/reservas/:reservaID/horario", async function (req, res, next) {
        const id = req.params.reservaID;
        try {
            const asinationSchedule = await reservacService.getScheduleFromAsignation(id);
            res.json(asinationSchedule.rows);
        } catch (err) {
            next(err);
        }
    });

    // Crear una reserva (se crea por debajo la solicitud y se acepta automaticamente para ser una reserva)
    router.post("/crear/reserva", async function (req, res, next) {
        const { requester, subject, room, quantity, material, semanas } = req.body[0]; //datos de la solicitud
        try {
            if (!req.body[1]) { // Verifica que el horario en el body no este vacio
                res.status(403).json({error: "Debe llenar un horario a solicitar reserva"})
            } else {
                // creamos la solicitud de reserva, tomamos el id, verificamos el tipo de semana y crean los horarios de esa solicitud
                const idCreatedRequest = await reservacService.createReservationAsAdmin(requester, subject, room, material, quantity)
                if (semanas == "todas") {
                    for (let index = 1; index < 13; index++) {
                        await reservacService.insertarhorario(index,req.body, idCreatedRequest);
                    }
                } else if (semanas == "pares") {
                    for (let index = 2; index < 13; index += 2) {
                        await reservacService.insertarhorario(index,req.body, idCreatedRequest);
                    }
                } else if (semanas == "impares") {
                    for (let index = 1; index < 13; index += 2) {
                        await reservacService.insertarhorario(index,req.body, idCreatedRequest);
                    }
                } else if (Number.isInteger(semanas) && semanas > 0 && semanas < 13) {
                    await reservacService.insertarhorario(semanas,req.body, idCreatedRequest);
                } else {
                    res.status(403).json({error: "No se esta especificando un tipo de semana correctamente"})
                }
                // Se verifica que los datos del front son correctos, y se crea la reserva a partir de la solicitud
                const solicitud = await reservacService.getScheduleFromRequestForPut(idCreatedRequest);
                const result = solicitud.rows[0];
                const checkSchedule = await reservacService.checkIfExists(room, idCreatedRequest);
                if (checkSchedule.rowCount > 0) {
                    res.status(403).json({error: `Ya existe una reserva en la sala ${room} con ese horario, Elimine la(s) Reservas en ese horario antes de aceptar esta solicitud (Comunicate con los administradores del ldac)`});
                    return
                } else {
                    await reservacService.createReservation(room, result.subject_id, result.trimester_id, result.send_time.toISOString().substring(0, 10), idCreatedRequest);
                    await reservacService.updateRequest(idCreatedRequest, 'Aprobado', 'A');
                    res.status(200).json({message: `Se creo exitosamente la reserva para la materia ${result.subject_id} en la sala ${room}`});
                    return
                }
            }
        } catch (err) {
            next(err)
        }
    });

    // Este endpoint es para probar el servicio de deleteScheduleAsignation (se puede borrar)
    router.delete("/eliminar/horario/reserva/prueba", async function (req, res, next) {
        try {
            const { id_asignation, hour, day, week } = req.body;
            if (await reservacService.deleteHourScheduleAsignation(id_asignation, hour, day, week) == 1) {
                res.send('Funciono')
            } else {
                res.send('NO funciona')
            }
        } catch (error) {
            next(error);
        }
    })

     // Elimina schedule por hora de las asignation (reservaciones ya hechas)
     router.delete("/eliminar/reserva", async function (req, res) {
        const { room, semanas } = req.body[0]; //datos de la solicitud
        try {
            if (!req.body[1]) { // Verifica que el horario en el body no este vacio (Aqui estan las horas a eliminar)
                res.status(403).json({error: "Debe llenar una asignatura a eliminar"})
            } else {
                // Verifico el tipo de eliminacion segun tipo semanal (eliminar en todas las pares, impares, todas, spec)
                if (semanas == "todas") {
                    for (let semana = 1; semana < 13; semana++) {
                        await reservacService.deleteScheduleFromAdmin(semana,req.body,room);
                    }
                } else if (semanas == "pares") {
                    for (let semana = 2; semana < 13; semana += 2) {
                        await reservacService.deleteScheduleFromAdmin(semana,req.body, room);
                    }
                } else if (semanas == "impares") {
                    for (let semana = 1; semana < 13; semana += 2) {
                        await reservacService.deleteScheduleFromAdmin(semana,req.body, room);
                    }
                } else if (Number.isInteger(semanas) && semanas > 0 && semanas < 13) {
                    await reservacService.deleteScheduleFromAdmin(semanas,req.body, room);
                } else {
                    res.status(403).json({error: "No se esta especificando un tipo de semana correctamente"})
                }
                res.status(200).json({message: `Se elimino exitosamente los horarios seleccionados`});
            }
        } catch (err) {
            res.status(403).json({error: err})
            // next(err)
        }
    });


    //  **************************** SOLICITUDES DE RESERVA ********************************


    // Obtener todos los horarios reservados para una sala todas las semanas


    //  Obtener informacion de una solicitud y su horario
    router.get("/solicitudes/:solicitudId", async function (req, res, next) {
        const solicitudId = req.params.solicitudId;
        try {
            // const schedule = await reservacService.getScheduleFromRequest(solicitudId);
            const requestFromUser = await reservacService.getRequest(solicitudId);
            res.status(200).send(requestFromUser.rows);
        } catch (err) {
            next(err);
        }
    });

    // Obtener horario de una solicitud de reserva
    router.get("/solicitudes/:solicitudId/horario", async function (req, res, next) {
        const solicitudId = req.params.solicitudId;
        try {
            const schedule = await reservacService.getScheduleFromRequest(solicitudId);
            res.json(schedule);
        } catch (err) {
            next(err);
        }
    });

    //  Obtener todas las solicitudes hechas por un usuario
    router.get("/solicitudes/usuario/:userId", async function (req, res, next) {
        const userId = req.params.userId;
        try {
            const requestFromUser = await reservacService.getRequestUser(userId);
            res.status(200).send(requestFromUser.rows);
        } catch (err) {
            next(err);
        }
    });

    // Obtener todas las solicitudes correspondientes a un laboratorio.
    router.get("/solicitudes/admin/:labId", async function (req, res, next) {
        const labId = req.params.labId;
        try {
            const requestFromUser = await reservacService.getRequests(labId);
            res.status(200).send(requestFromUser.rows);
        } catch (err) {
            next(err);
        }
    });

    // Crear una solicitud reserva
    router.post("/crear/solicitudes/reserva", async function (req, res, next) {
        let { requester, subject, room, quantity, material, semanas } = req.body[0]; //datos de la solicitud
        try {
            if (!req.body[1]) {
                res.status(403).json({error: "Debe llenar un horario a solicitar reserva"})
            } else {
                if (isNaN(quantity) || quantity < 0) {
                    res.status(403).json({error: "La cantidad de estudiantes debe ser un numero positivo"})
                }
                if (!material) {
                    material = "No hay requerimientos"
                }
                const id = await reservacService.createReservationRequest(requester, subject, room, material, quantity)
                if (semanas == "todas") {
                    for (let index = 1; index < 13; index++) {
                        await reservacService.insertarhorario(index,req.body, id);
                    }
                } else if (semanas == "pares") {
                    for (let index = 2; index < 13; index += 2) {
                        await reservacService.insertarhorario(index,req.body, id);
                    }
                } else if (semanas == "impares") {
                    for (let index = 1; index < 13; index += 2) {
                        await reservacService.insertarhorario(index,req.body, id);
                    }
                } else if (Number.isInteger(semanas) && semanas > 0 && semanas < 13) {
                    await reservacService.insertarhorario(semanas,req.body, id);
                } else {
                    res.status(403).json({error: "No se esta especificando un tipo de semana correctamente"})
                }
                res.status(201).json({message: "Se creo correctamente la solicitud"})
            }
        } catch (err) {
            next(err)
        }
    });

    // Actualizar una solicitud por id = <request_id> .
    router.put("/solicitudes/reserva/:requestId", async function (req, res, next) {
        const requestId = req.params.requestId;
        let { reason, status } = req.body;
        try {
            const solicitud = await reservacService.getScheduleFromRequestForPut(requestId);
            if (solicitud.rowCount == 0) {
                res.status(403).json({error: `La reserva no posee ningun horario`});
                return
            }
            const result = solicitud.rows[0];
            let room = solicitud.rows[0].room_id;
            const checkSchedule = await reservacService.checkIfExists(room, requestId);
            if (status == 'A') {
                // Existe un horario ya asignado en ese horario que se solicita
                if (checkSchedule.rowCount > 0) {
                    res.status(403).json({error: `Ya existe una reserva en la sala ${room} con ese horario, Elimine la(s) Reservas en ese horario antes de aceptar esta solicitud`});
                    return
                } else {
                    await reservacService.createReservation(room, result.subject_id, result.trimester_id, result.send_time.toISOString().substring(0, 10), requestId);
                    await reservacService.updateRequest(requestId, 'Aprobado', 'A');
                    res.status(200).json({message: `Se creo exitosamente la reserva para la materia ${result.subject_id} en la sala ${room}`});
                    return
                }
            } else {
                if (!reason) {
                    reason = 'Solicitud Rechazada';
                    return
                }
                await reservacService.updateRequest(requestId, reason, 'R');
                res.status(200).json({message: 'Solicitud Actualizada'});
                return
            }
        } catch (err) {
            next(err);
        };
    });

    // Eliminar solicitud de reserva de una sala
    router.delete("/eliminar/solicitud/reserva/:idResquest", async function (req, res, next) {
        const requestId = req.params.idResquest;
        await reservacService.deleteRequest(requestId);
        try {
            res.status(200).json({message: 'Solicitud eliminada satisfactoriamente'});
        } catch (err) {
            next(err);
        };
    });

    //  ****************************  SOLICITUDES ROOM REQUEST ********************************

    //Obtener solicitudes de sala por parte de un usuario en especifico

    router.get("/sala/solicitudes/crear/:userId", async function(req,res,next){
        const userId= req.params.userId;
      
        try{

            const result= await reservacService.getRoomRequestFromUser(userId);
            res.status(200).send(result.rows);
        }
        catch(err){
            next(err);
        }

    });


    // Actualizar status de una solicitud de creacion de sala (crear en caso de aceptar y no existir)
    router.put("/sala/solicitudes/:roomRequestId", async function (req, res, next) {
        const id = req.params.roomRequestId;
        const status = req.body.status;
        const result = await reservacService.updateRoomRequest(id, status);
        let date = moment().format('YYYY-MM-DD');
        if (!result) {

            res.status(403).json({error : `La sala ya ha sido asignada previamente a un laboratorio y se encuentra activa`});

        } else {
            try {
                if (status == 'A') {
                    try {
                        await reservacService.createSalaFromRequest(id, date);
                    }
                    catch (err) {
                        next(err);
                    }
                }
                res.status(200).json({error : `Solicitud de agregar sala Atendida`});
            }
            catch (err) {
                next(err);
            };
        }
    });

    // Crear una solicitud de sala
    router.post("/sala/solicitudes/crear/:userId", async function (req, res, next) {
        const userId = req.params.userId;
        const room_id = req.body.room_id;
        let date = moment().format('YYYY-MM-DD');
        const result = await reservacService.createRoomRequest(room_id,userId, date);
        if(result==null){
            res.status(403).json({error: `El usuario no esta autorizado a reservar salas o no se ha introducido el id de la sala`});
        }
        else{
            try {            
                res.status(201).json({message :  `Solicitud de sala ${room_id} creada exitosamente`});
            } catch (err) {
                next(err);
            }
        }
    });

    // Obtener todas las room_request
    router.get("/labf/solicitudes", async function (req, res, next) {
        try {
            const requests = await reservacService.getRoomRequest();
            res.status(200).send(requests.rows);
        } catch (err) {
            next(err);
        }
    });


    //  **************************** USUARIOS ********************************

    // Obtener un usuario de la base de datos.
    router.get("/usuario/:userId", async function (req, res, next) {
        const userId = req.params.userId;
        try {
            const requestFromUser = await reservacService.getUser(userId);
            if (requestFromUser.rows.length) {
                res.status(200).send(requestFromUser.rows);
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
                res.status(200).send(requestFromUser.rows);
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
                res.status(200).send(adminUsers.rows);
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
            res.status(200).send(profesor.rows);
        } catch (err) {
            next(err);
        }
    });

    //  **************************** MATERIAS ********************************

    // Obtener todas las materias en el sistema
    router.get("/subjects", async function (req, res, next) {
        try {
            const subjects = await reservacService.getSubjects();
            res.status(200).send(subjects.rows);
        } catch (err) {
            next(err);
        }
    });



    //  *****************************Registro y autenticacion de Usuarios************

    router.post("/signup", async function (req,res,next){
        try{
            const {usbId, name, email, type, chief,clave} = req.body;
            const registro= await reservacService.registerUser(usbId,name,email,type,chief,clave);
            
            res.json ({auth: true, token : registro});           

        }catch(err){

            next(err);
        }
    });

    router.post("/signin", async function (req,res,next){
        try{

            const {usbId, clave} = req.body;
            const login= await reservacService.loginUser(usbId, clave);
            if (login==0){
                res.status(404).send("Usuario no registrado en la base de datos");
            }else if(login==1){
                res.status(403).send("Clave incorrecta");
            }
            else{
            res.json({auth: true, token: login});
            }       

        }catch(err){
            next(err);
        }
    });
    //  *****************************Metricas************************************
    router.get("/metrics/usoDeSala/:RoomId", async function (req, res, next) {

        const room_id=req.params.RoomId;
        const fechaInicio= req.body.fechaInicio;
        if(fechaInicio==undefined){
            res.status(403).json({error: `No se ha introducido ninguna fecha`})
            return
        }
        try {
            const result = await reservacService.usoDesdeFecha(room_id, fechaInicio);
            if (result!=null){
                res.status(200).send(`La sala ha sido utilizada por ${result} estudiantes desde la fecha ${fechaInicio} hasta la fecha actual`);
            }
            else{
                res.status(200).send(`La sala no ha sido utilizada por ningun estudiante desde la fecha ${fechaInicio} hasta la fecha actual`);
            }
        } catch (err) {
            next(err);
        }
    });
    router.get("/metrics/totalReservas", async function (req, res, next) {               
        const modo= req.body.modo;
        let result;
        try {
            result= await reservacService.numeroDeReservas(modo);
        }
        catch(err){
            next(err);
        }
        if(modo=='A'){
            res.status(200).send(`Existen un total de ${result} reservas aprobadas en el sistema`);
        }
        else if(modo=='P'){
            res.status(200).send(`Existen un total de ${result} reservas en espera en el sistema`);
        }
        else if(modo=='R'){
            res.status(200).send(`Existen un total de ${result} reservas rechazadas en el sistema`);
        }
        else if(modo=='T'){
            res.status(200).send(`Existen un total de ${result} reservas en el sistema`);
        }
        else{
            res.status(403).json({error : `El filtro seleccionado no es valido`});
        }
    });
    router.get("/metrics/variacionItems/:RoomId", async function (req, res, next) {

        const room_id=req.params.RoomId;
        const trimestreInicio= req.body.trimestreInicio;
        const trimestreFinal= req.body.trimestreFinal;
        if(trimestreInicio==undefined || trimestreFinal==undefined){
            res.status(403).json({error: `No se ha introducido el trimestre inicio o trimestre final`})
            return
        }
        try {
            const result = await reservacService.variacionItems(room_id, trimestreInicio, trimestreFinal);
            if (result==0){
                res.status(404).json({error : `El trimestre de inicio o trimestre final introducidos no existen en el sistema o son iguales`});
            }
            else{
               res.status(200).send(result.rows)
            }
        } catch (err) {
            next(err);
        }
    });

}
module.exports = reservACapi;