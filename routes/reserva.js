const express = require('express');

/* Route controllers */
const ReservacService = require('../services/reserva');
const ItemController = require('../controllers/items.controller');
const SalaController = require('../controllers/salas.controller');
const TrimesterController = require('../controllers/trimester.controller');
const ReservationController = require('../controllers/reservations.controller');
const ReservationRequestController = require('../controllers/reservationRequest.controller')
const RoomRequestController = require('../controllers/roomRequest.controller')
const SubjectsController = require('../controllers/subjects.controller')
/* Validations */
const boom = require('@hapi/boom');
//const Auth= require('../authentication/auth.js');


function reservACapi(app) {

    const router = express.Router();
    const reservacService = new ReservacService;
    const itemController = new ItemController;
    const salasController = new SalaController;
    const trimesterController = new TrimesterController;
    const reservationController = new ReservationController;
    const reservationReqController = new ReservationRequestController;
    const roomReqController = new RoomRequestController;
    const subjectController = new SubjectsController;
    // const auth = new Auth;

    // Prefix Route
    app.use("/api/", router);


/*
    ***************************************************************
    ************************* TRIMESTER ROUTES **********************
    *******************************************************************
*/

    /* DAEMON autoUpdate Trimester (use by script updateTrimester) */
    router.get("/actualizarTrimestre", trimesterController.autoUpdateTrim);

    /* GET actual trimester */
    router.get("/trimestre/ultimo", trimesterController.getLastTrimester);

    /* PUT update actual trimester  */
    router.put("/trimestre/:Id", trimesterController.updateTrimester);

/*
    ***************************************************************
    *************************** ITEMS ROUTES ************************
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

/*
    ***************************************************************
    *************************** ROOMS ROUTES ************************
    *******************************************************************
*/

    /* [TESTED] Mostrar todas las salas existentes */
    router.get("/salas", salasController.allRooms);

    /* [TESTED] Mostrar datos de una Sala */
    router.get("/salas/:salaId", salasController.specificRoom);

    /* [TESTED] Mostrar los items que posee una sala */
    router.get("/salas/:salaId/items", salasController.getRoomItems);

    /* [TESTED] Mostrar todos los items menos los de que ya posee una sala */
    router.get("/not/items/:roomId", salasController.itemsNoOwned);

    /* [TESTED] Obtener todas las salas que son administradas por un laboratorio */
    router.get("/salas/admin/:userId", salasController.adminRooms);

    /* [TESTED] Obtener la imagen de una sala */
    router.get("/salas/:salaId/picture", salasController.getImageRoom);

    /* [TESTED] Eliminar un item de una sala en el trimestre actual */
    router.delete("/salas/:salaId/:itemId", salasController.deleteRoomItem);

    /* [TESTED] Actualizar la cantidad de un item de una sala en el trimestre actual */
    router.put("/salas/:salaId/:itemId", salasController.updateRoomItems);

    /* [TESTED] Actualizar descripcion nombre y status de una sala */
    router.put("/salas/:salaId", salasController.updateRoom);

    /* [TESTED] Crear una nueva sala */
    router.post("/salas/crear", salasController.createRoom);

    /* [TESTED] Agregar un item a la sala para el trimestre actual */
    router.post("/salas/:salaId/:itemId", salasController.addRoomItem);

    /* Subir una nueva imagen */
    router.post("/salas/:salaId/picture/new", salasController.uploadRoomImage);

/*
    ***************************************************************
    ********************** RESERVATIONS ROUTES **********************
    *******************************************************************
*/

   /*  Obtener los horarios reservados para el tipo de semanas: week = { 'todas', 'pares', 'impares', [1...12]} */
   router.get("/reservas/:roomId/semana/:week", reservationController.HoursReservedByTypeWeek);

    /* Obtener todas las reservas de una sala */
    router.get("/reservas/:roomId", reservationController.asignationsFromRoom);

    /*  Obtener el horario de una reserva */
    router.get("/reservas/:reservaID/horario", reservationController.asignationSchedule);

    /* Crear una reserva (se crea por debajo la solicitud y se acepta automaticamente para ser una reserva) */
    router.post("/crear/reserva", reservationController.createNewReservation);


/*
    ***************************************************************
    ****************** RESERVATIONS REQUEST ROUTES ******************
    *******************************************************************
*/

    // Obtener todos los horarios reservados para una sala todas las semanas


    /*  Obtener informacion de una solicitud y su horario */
    router.get("/solicitudes/:solicitudId", reservationReqController.getReservationReq);

    /* Obtener horario de una solicitud de reserva */
    router.get("/solicitudes/:solicitudId/horario", reservationReqController.getReservationReqSchedule);

    /*  Obtener todas las solicitudes hechas por un usuario */
    router.get("/solicitudes/usuario/:userId", reservationReqController.userReservationsReqs);

    /* Obtener todas las solicitudes correspondientes a un laboratorio. */
    router.get("/solicitudes/admin/:labId", reservationReqController.adminReservationsRequest);

    /* Crear una solicitud reserva */
    router.post("/crear/solicitudes/reserva", reservationReqController.createReservationRequest);

    /* Actualizar (Aceptar/rechazar) una solicitud */
    router.put("/solicitudes/reserva/:requestId", reservationReqController.manageReservationReq);

    /* Eliminar solicitud de reserva de una sala */
    router.delete("/eliminar/solicitud/reserva/:idResquest", reservationReqController.deleteReservationReq);

/*
    ***************************************************************
    ********************** ROOM REQUEST ROUTES **********************
    *******************************************************************
*/
    // [CAMBIAR ESTA RUTA MIERDERA, QUE CARAJO EL /CREAR/? CARLOS - ACTUALIZAR CON FRONT]
    /* Obtener solicitudes de sala por parte de un usuario en especifico */
    router.get("/sala/solicitudes/crear/:userId", roomReqController.getRoomReqFromAdminLab);

    /* Obtener todas las room_request */
    router.get("/labf/solicitudes", roomReqController.getAllRoomRequest);

    /* Actualizar status de una solicitud de creacion de sala (crear en caso de aceptar y no existir) */
    router.put("/sala/solicitudes/:roomRequestId", roomReqController.manageRoomRequest);

    /* Crear una solicitud de sala */
    router.post("/sala/solicitudes/crear/:userId", roomReqController.createRoomRequest);

/*
    ***************************************************************
    ************************ USERS ROUTES****************************
    *******************************************************************
*/

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

/*
    ***************************************************************
    ************************ SUBJECTS ROUTES ************************
    *******************************************************************
*/

    /* Obtener todas las materias en el sistema */
    router.get("/subjects", subjectController.getSubjects);

/*
    ***************************************************************
    ************************ USERS AUTH ROUTES **********************
    *******************************************************************
*/

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