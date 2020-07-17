const express = require('express');

/* Route controllers */
const ItemController = require('../controllers/items.controller');
const SalaController = require('../controllers/salas.controller');
const TrimesterController = require('../controllers/trimester.controller');
const ReservationController = require('../controllers/reservations.controller');
const ReservationRequestController = require('../controllers/reservationRequest.controller')
const RoomRequestController = require('../controllers/roomRequest.controller')
const SubjectsController = require('../controllers/subjects.controller');
const UserController = require('../controllers/users.controller');
const MetricsController = require('../controllers/metric.controller');
//const Auth= require('../authentication/auth.js');


function reservACapi(app) {

    const router = express.Router();
    const itemController = new ItemController;
    const salasController = new SalaController;
    const trimesterController = new TrimesterController;
    const reservationController = new ReservationController;
    const reservationReqController = new ReservationRequestController;
    const roomReqController = new RoomRequestController;
    const subjectController = new SubjectsController;
    const userController = new UserController;
    const metricController = new MetricsController;
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
    ************************ USERS ROUTES ****************************
    *******************************************************************
*/

    /* Obtener un usuario de la base de datos. */
    router.get("/usuario/:userId", userController.getUser );

    /*  Obtener todos los usuarios */
    router.get("/usuarios", userController.getUsers);

    /* Obtener todos los usuarios que son laboratorio docente */
    router.get("/usuarios/admin", userController.getAdmins);

    /* Obtener todos los usuarios que son profesor o estudiante */
    router.get("/usuarios/profesor", userController.getStandardUsers);

    /* Registrar un nuevo usuario */
    router.post("/signup", userController.signUp);

    /* Inicio de sesion */
    router.post("/signin", userController.signIn);

/*
    ***************************************************************
    ************************ SUBJECTS ROUTES ************************
    *******************************************************************
*/

    /* Obtener todas las materias en el sistema */
    router.get("/subjects", subjectController.getSubjects);

/*
    ***************************************************************
    ************************ METRICS ROUTES *************************
    *******************************************************************
*/

    /* Obtener el numero de estudiantes que ha usado la sala hasta la actualidad */
    router.get("/metrics/usodesala/:RoomId", metricController.roomUsage);

    /* Obtener el numero de reservas que ha tenido la sala desde una fecha de inicio hasta una fecha final */
    router.get("/metrics/totalreservas", metricController.getReservationsQuantity);

    /* Obtener la variaciones de los items desde un trimestre a otro especificado */
    router.get("/metrics/variacionitems/:RoomId", metricController.getItemsVarations);

}
module.exports = reservACapi;