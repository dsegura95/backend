const express = require('express');
const multer = require("multer");
//const fs = require('fs');
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
        //console.log("start:" + start, "finish: "+ finish)
        //aqui
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

    //  *** Eliminar un item de una sala en el trimestre actual ***
    router.delete("/salas/:salaId/:itemId", async function (req, res, next) {
        const id = req.params.itemId;
        const salaId = req.params.salaId;
        await reservacService.deleteSalaItem(id, salaId);
        try {
            res.status(200).send(`Item Id: ${id} Eliminado correctamente`);
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

    //  *** Asignar un item a la sala para el trimestre acual ***
    router.post("/salas/:salaId/:itemId", async function (req, res, next) {
        const { quantity } = req.body;
        const room_id = req.params.salaId;
        const item_id = req.params.itemId;
        try {
            await reservacService.crearSalaItem(room_id, item_id, quantity);
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

    router.post("/salas/:salaId/picture", async function (req, res) {

        // Set The Storage Engine
        const storage = multer.diskStorage({
            destination: '/../media/',
            filename: function(req, file, cb){
            cb(null,'${salaId}.jpg');
            }
        });

        // Init Upload
        const upload = multer({
            storage: storage,
            limits:{fileSize: 10000000},
            fileFilter: function(req, file, cb){
            checkFileType(file, cb);
            }
        }).single('myImage');
            
        // Check File Type
        function checkFileType(file, cb){
            // Allowed ext
            const filetypes = /jpg/;
            // Check ext
            const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
            // Check mime
            const mimetype = filetypes.test(file.mimetype);
            if(mimetype && extname){
            return cb(null,true);
            } else {
            cb('Error: Images Only!');
            }
        }

        upload(req, res, (err) => {
            if(err){
                res.json(boom.notFound(err).output.payload);
            } else {
                if(req.file == undefined){
                res.json(boom.notFound('Error: No File Selected!').output.payload);
                } else {
                    res.status(200).json({message : 'File Uploaded!'});
                }
            }
        });
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
            res.status(200).send(schedule.rows);
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

    // Actualizar una solicitud por id = <request_id> .
    router.put("/solicitudes/reserva/:requestId", async function (req, res, next) {
        const requestId = req.params.requestId;
        let { reason, status } = req.body;
        try {
            const solicitud = await reservacService.getScheduleFromRequest(requestId);
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

    //  ****************************  SOLICITUDES ROOM REQUEST ********************************

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
                res.status(200).json({error : `Solicitud de sala id: ${id} modificada correctamente`});
            }
            catch (err) {
                next(err);
            };
        }
    });

    // Crear una solicitud de sala
    router.post("/sala/solicitudes/crear", async function (req, res, next) {
        const { room_id, manager_id } = req.body;
        let date = moment().format('YYYY-MM-DD');
        try {
            await reservacService.createRoomRequest(room_id, manager_id, date);
            res.status(201).json({message :  `Sala ${room_id} creada exitosamente`});
        } catch (err) {
            next(err);
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

}
module.exports = reservACapi;