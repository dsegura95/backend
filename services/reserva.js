const { Pool } = require('pg')
const Auth = require('../authentication/auth.js')
const { config } = require('../config/index.js');




//  ************************ ACCESO A BD POSTGRESQL  ***********************
// Obtiene todos estos valores del ./config/index.js
// PD: para el refactor del codigo seria bueno que anada condicionales aqui para correr con BD de QA y BD de PROD, para los tests de QA con jenkins
const pool = new Pool({
    host: config.host,
    user: config.user,
    password: config.password,
    database: config.database,
    port: config.portdb
})

// *********************Se importan metodos de autenticacion ********************

const auth = new Auth;

//const ACTUAL_TRIM = pool.query('SELECT id FROM trimester ORDER BY id DESC LIMIT 1');

class ReservacService {

    //  ************************ SERVICIOS MODELO DE ITEM  ***********************

    async getItems() {
        let query = 'SELECT * FROM item';
        const items = await pool.query(query);
        return items || [];
    }

    async getItemsNoOwned(roomId) {
        let arrayOfItems = []
        const idsItems = await this.getSalaItems(roomId);
        // Obtenemos todos los items perteneciente a la sala y guardamos sus ids en un arreglo
        if (idsItems.rowCount > 0 ) {
            for (let index = 0; index < idsItems.rowCount; index++) {
                const element = idsItems.rows[index];
                arrayOfItems.push(element.id)
            }
            let query = `SELECT * FROM item WHERE id NOT IN (${arrayOfItems})`;
            // Obtiene todos los items que no posee esa sala
            const ItemsNoOwned = await pool.query(query);
            return ItemsNoOwned;
        } else {
            return idsItems;
        }
    }

    async getItem(id) {
        let query = `SELECT * FROM item WHERE id = ${id}`;
        const item = await pool.query(query);
        return item || [];
    }

    async createItem(name, description) {
        let query = `INSERT INTO item (name, description) VALUES ('${name}','${description}')`;
        const createItemId = await pool.query(query);
        return createItemId;
    }

    async updateItem(id, name, description) {
        let query = `UPDATE item SET name = '${name}', description = '${description}' WHERE id = ${id}`;
        const updateItem = await pool.query(query);
        return updateItem;
    }

    async deleteItem(id) {
        let query = `DELETE FROM item WHERE id = '${id}'`;
        await pool.query(query);
        return;
    }

    //  ************************ SERVICIOS DE LAS SALA  ***********************

    async getSalasActivas() {
        let query = 'SELECT id FROM room WHERE is_active = true';
        const items = await pool.query(query);
        return items || [];
    }

    async getSalas() {
        let query = 'SELECT * FROM room WHERE is_active = true';
        const items = await pool.query(query);
        return items || [];
    }

    async getSala(id) {
        let query = `SELECT * FROM room WHERE id = '${id}'`;
        const sala = await pool.query(query);
        return sala || [];
    }

    ///////////////////////////////////////////////////////////////////////////////
    //Crud Sala Items

    async getSalaItemsByTrim(id, trimId) {
        let sql = `SELECT i.id, i.name, i.description, r.quantity FROM room_item AS r INNER JOIN item AS i ON i.id = r.item_id WHERE room_id = '${id}' AND trimester_id = '${trimId}'`;
        const itemsSala = await pool.query(sql);
        return itemsSala || [];
    }

    async getSalaItems(id) {
        let actualTrimId = await this.getActualTrim();
        let sql = `SELECT i.id, i.name, i.description, r.quantity FROM room_item AS r INNER JOIN item AS i ON i.id = r.item_id WHERE room_id = '${id}' AND trimester_id = '${actualTrimId.rows[0].id}'`;
        const itemsSala = await pool.query(sql);
        return itemsSala || [];
    }

    async deleteSalaItem(id, salaId) {
        let actualTrimId = await this.getActualTrim();
        let query = `DELETE FROM room_item AS r WHERE r.room_id = '${salaId}' AND r.item_id = ${id} AND r.trimester_id = '${actualTrimId.rows[0].id}'`;
        await pool.query(query);
        return;
    }

    async updateSalaItem(room_id, item_id, quantity) {
        let trimester_id = await this.getActualTrim();
        let query = `UPDATE room_item SET quantity = '${quantity}' WHERE room_id = '${room_id}' AND trimester_id = '${trimester_id.rows[0].id}' AND item_id = '${item_id}'`;
        const updateItem = await pool.query(query);
        return updateItem;
    }

    async createSalaItem(room_id, item_id, quantity) {
        let trimester_id = await this.getActualTrim();
        let query = `INSERT INTO room_item (room_id, trimester_id, item_id, quantity) VALUES ('${room_id}','${trimester_id.rows[0].id}','${item_id}','${quantity}')`;
        const createItemId = await pool.query(query);
        return createItemId;
    }

    ///////////////////////////////////////////////////////////////////////////////

    async getAdminSalas(id) {
        const sql = `SELECT * FROM room WHERE manager_id = '${id}'`;
        const adminSalas = await pool.query(sql);
        return adminSalas || [];
    }

    //  ************************ Post  ***********************

    async createSala(id, name, owner_id, manager_id, is_active, description, first_used) {
        let query = `INSERT into room(id, name, owner_id, manager_id, is_active, description, first_used) VALUES
        ('${id}','${name}','${owner_id}','${manager_id}','${is_active}','${description}','${first_used}')`;
        const createSala = await pool.query(query);
        return createSala;
    }

    async createSalaFromRequest(requestId, first_used) {
        let query1 = `SELECT room.id from room join room_request on room_id=room.id
        where room_request.id='${requestId}'`;
        const roomExistente = await pool.query(query1);
        if (roomExistente.rowCount > 0) {
            let query2 = `UPDATE room SET owner_id=(SELECT owner_id from room_request where room_request.id='${requestId}'),
            manager_id=(SELECT manager_id from room_request where room_request.id='${requestId}'),
            is_active='t' where room.id=(${query1})`;
            const updateSala = await pool.query(query2);
            return updateSala;
        } else {
            let query3 = `INSERT into room (id, name, owner_id, manager_id, is_active, description, first_used) 
            SELECT room_id, room_id, owner_id, manager_id, 't', 'Sala recien creada', '${first_used}' from 
            room_request where room_request.id='${requestId}'`;
            const createSala = await pool.query(query3);
            return createSala;
        }
    }

    //  ************************ Put  ***********************

    async updateSala(id, name, description, is_active) {
        let query;
        let change = 0;

        if (name) {
            query = `UPDATE room SET name = '${name}' WHERE id = '${id}'`;
            await pool.query(query);
            change = 1;
        }
        if (description) {
            query = `UPDATE room SET description = '${description}' WHERE id = '${id}'`;
            await pool.query(query);
            change = 1;
        }
        if (is_active == "true") {
            query = `UPDATE room SET is_active = '${is_active}' WHERE id = '${id}'`;
            await pool.query(query);
            change = 1;
        }
        if (is_active == "false") {
            let howManyAsig = await this.getReservationByRoom(id);
            if (howManyAsig.rowCount == 0) {
                query = `UPDATE room SET is_active = '${is_active}' WHERE id = '${id}'`;
                change = await pool.query(query);
                change = 1;
            }
            else {
                change = -1;
            }
        }
        return change;
    }

    //
    async deleteSala(id) {
        let query = `DELETE FROM room WHERE id = '${id}'`;
        const deleteItem = await pool.query(query);
        return deleteItem;
    }

    //  ********************* SERVICIOS DE TRIMESTRE  *********************

    async getActualTrim() {
        const sql = 'SELECT * FROM trimester ORDER BY finish DESC LIMIT 1';
        const trim = await pool.query(sql);
        return trim || [];
    }

    async createTrim(id, start, finish) {
        let query = `INSERT INTO trimester (id, start, finish) VALUES ('${id}','${start}','${finish}')`;
        const createTrim = await pool.query(query);
        return createTrim;
    }

    async updateTrim(id, start, finish) {
        let query;

        let dates = await this.getActualTrim();
        let strt = dates.rows[0].start.toISOString().substring(0, 10);
        let fnsh = dates.rows[0].finish.toISOString().substring(0, 10);
        if ((!start) && (finish > strt)) {
            query = `UPDATE trimester SET finish = '${finish}' WHERE id = '${id}'`;
        }
        else if ((!finish) && (fnsh > start)) {
            query = `UPDATE trimester SET start = '${start}' WHERE id = '${id}'`;
        }
        else if (finish > start) {
            query = `UPDATE trimester SET start = '${start}', finish = '${finish}' WHERE id = '${id}'`;
        }
        else {
            return null;
        }
        const updateTrim = await pool.query(query);
        return updateTrim;
    }

    //  ********************* SERVICIOS DE RESERVA (ASIGNATION)  *********************

    async getScheduleFromAsignation(id) {
        let query = `SELECT * FROM asig_schedule WHERE asignation_id = ${id}`;
        const schedule = await pool.query(query);
        return schedule || [];
    }

    async getReservationByRoom(roomId) {
        let trimester_id = await this.getActualTrim();
        let query = `SELECT * FROM asignation WHERE room_id = '${roomId}' AND trimester_id = '${trimester_id.rows[0].id}'`;
        const request = await pool.query(query);
        return request || [];
    }

    async getReservationFromWeek(room, week) {
        let trimester_id = await this.getActualTrim();
        let query = `SELECT subject_id, day, hour, week FROM asignation AS r JOIN asig_schedule AS s ON r.id = s.asignation_id WHERE week = ${week} AND room_id = '${room}' AND trimester_id = '${trimester_id.rows[0].id}'`;
        const request = await pool.query(query);
        return request || [];
    }

    // Crea la reserva y su horario a partir de la solicitud y el horario de solicitud
    async createReservation(room, subject_id, trimester_id, date, requestId) {
        let query = `INSERT INTO asignation (room_id, subject_id, trimester_id, date) VALUES ('${room}','${subject_id}','${trimester_id}','${date}') RETURNING id`;
        const createAsignation = await pool.query(query);
        const id = createAsignation.rows[0].id
        const request_schedule = await this.getScheduleFromRequestForPut(requestId);
        for (let index = 0; index < request_schedule.rowCount; index++) {
            const element = request_schedule.rows[index];
            let query1 = `INSERT INTO asig_schedule (asignation_id, week, day, hour) VALUES (${id},${element.week},'${element.day}',${element.hour})`
            await pool.query(query1);
        }
        return createAsignation;
    }

    //  ********************* SERVICIOS DE SOLICITUD  *********************

    async getRequest(solicitudId) {
        let query = `SELECT * FROM reservation_request WHERE id = ${solicitudId}`;
        const request = await pool.query(query);
        return request || [];
    }

    // async VerificarHorario(id, week, day, hour) {
    //     let query = `SELECT reservation_request_id FROM reservation_request_schedule WHERE week = ${week} AND day = '${day}' AND hour = ${hour} AND id != ${id} GROUP BY reservation_request_id`;
    //     const horariosDeOtroRequest = pool.query(query);
    //     return horariosDeOtroRequest || [];
    // }

    async getScheduleFromRequestForPut(solicitudId) {
        let query = `SELECT * FROM reservation_request_schedule AS horario JOIN reservation_request AS solicitud ON
                     horario.reservation_request_id = solicitud.id WHERE reservation_request_id = ${solicitudId}`;
        const request = await pool.query(query);
        return request || []
    }

    async getScheduleFromRequest(solicitudId) {
        let query = `SELECT * FROM reservation_request_schedule AS horario JOIN reservation_request AS solicitud ON
                     horario.reservation_request_id = solicitud.id WHERE reservation_request_id = ${solicitudId}`;
        const request = await pool.query(query);
        const content = request.rows;
        const response = {
            typeWeek: "-1",
            shedule: content
        };
        if (content.length == 1) {
            response.typeWeek = content[0].week.toString();
        }
        else if (content.length > 1) {
            const first = content[0];
            const second = content[1];
            if (first.hour == second.hour) {
                if (first.week % 2 == 0) {
                    if (second.week % 2 == 0) {
                        response.typeWeek = "pares";
                    }
                    else{
                        response.typeWeek = "todas";
                    }
                }
                else{
                    if (second.week % 2 != 0) {
                        response.typeWeek = "impares";
                    }
                    else{
                        response.typeWeek = "todas";
                    }
                }
            }else{
                response.typeWeek = content[0].week.toString();
            }
        }
        return response;
    }

    //tomo el horario de la solicitud, tomo la sala a la cual va la solicitud, busco todos los horarios de esa sala
    async checkIfExists(roomId, solicitudId) {
        let query = `SELECT * FROM reservation_request_schedule AS r JOIN (SELECT * FROM asignation JOIN
            asig_schedule ON asignation.id = asig_schedule.asignation_id WHERE room_id = '${roomId}')
            AS result ON result.day = r.day AND result.hour = r.hour WHERE r.reservation_request_id = ${solicitudId}`;
        const request = await pool.query(query);
        return request || [];
    }

    async getRequestUser(userId) {
        const trimestre = await this.getActualTrim();      //Se obtiene el trimestre actual
        let query = `SELECT * FROM reservation_request WHERE requester_id = '${userId}' AND trimester_id = '${trimestre.rows[0].id}'`;
        const requestsUsers = await pool.query(query);
        return requestsUsers || [];
    }

    async getAllPendingRequestOfLastTrim(trimester_id) {
        let query = `SELECT id FROM reservation_request WHERE status = 'P' AND trimester_id = '${trimester_id}'`;
        const requests = await pool.query(query);
        return requests || [];
    }

    async getRequests(labId) {
        let query = `SELECT result.id, name, requester_id, room_id, subject_id, send_time, reason, material_needed, type, status, quantity
        FROM (SELECT reservation_request.id, requester_id, room_id, subject_id, send_time, trimester_id, reason,
        material_needed, quantity, status FROM reservation_request JOIN room ON reservation_request.room_id = room.id
        JOIN usuario ON usuario.id = room.manager_id WHERE manager_id = '${labId}') AS result JOIN usuario ON usuario.id = result.requester_id
        WHERE status = 'P'`;
        const requests = await pool.query(query);
        return requests || [];
    }

    async updateRequest(id, reason, status) {
        let query = `UPDATE reservation_request SET reason = '${reason}', status = '${status}' WHERE id = ${id}`;
        const request_updated = await pool.query(query);
        return request_updated;
    }

    async createReservationRequest(requester, subject, room, material, quantity) {
        const temp = await this.getActualTrim();
        const trimestreActual = (temp.rows[0].id);
        let query = `INSERT into reservation_request(requester_id, room_id, subject_id, trimester_id, reason, material_needed, quantity, status) VALUES
                    ('${requester}', '${room}', '${subject}', '${trimestreActual}', 'En espera', '${material}', ${quantity}, 'P') RETURNING id`;
        const createdRequest = await pool.query(query);
        const id = createdRequest.rows[0].id
        return createdRequest,id;
    }

    async createReservationAsAdmin(requester, subject, room, material, quantity) {
        const temp = await this.getActualTrim();
        const trimestreActual = (temp.rows[0].id);
        let query = `INSERT into reservation_request(requester_id, room_id, subject_id, trimester_id, reason, material_needed, quantity, status) VALUES
                    ('${requester}', '${room}', '${subject}', '${trimestreActual}', 'Solicitud Aceptada', '${material}', ${quantity}, 'A') RETURNING id`;
        const createdRequest = await pool.query(query);
        const id = createdRequest.rows[0].id
        return createdRequest,id;
    }

    // Funcion para insertar horario en una semana especifica (utilizar con loop todas, pares, impares, especifica)
    async insertarhorario(semana, horarios,id) { // Horario es el req.body completo, los horarios empiezan en el req.body[1]
        for (let index = 1; index < horarios.length; index++) {
            const horario = horarios[index];
            const { dia, hora } = horario
            await this.createReservationRequestSchedule(dia, hora, semana, id)
        }
    }

    async deleteHourScheduleAsignation(asignationId, hour, day, week) {
        let query = `DELETE FROM asig_schedule WHERE asignation_id = ${asignationId} AND day = '${day}' AND hour = ${hour}
        AND week = ${week}`
        const result = await pool.query(query)
        return result.rowCount
    }

    // Funcion para eliminar horario (hora) en una semana especifica (utilizar con loop todas, pares, impares, especifica)
    async deleteScheduleFromAdmin(semana, horarios, room) {
        // Guardo los asignations que existen que existen en esa <room> para obtener los subjects y compararlos con los que se quieren eliminar
        let asigInRoom = await this.getReservationByRoom(room)
        asigInRoom = asigInRoom.rows
        for (let index = 1; index < horarios.length; index++) {
            // Obtego el dia, hora, materia, del body (cada elemento req.body[x] con x > 0 representa una hora en Z dia )
            const horario = horarios[index];
            const { dia, hora, subject } = horario
            // Itero sobre las asignaciones que hay en la sala para hallar cual es la que se quiere modificar
            for (let index2 = 0; index2 < asigInRoom.length; index2++) {
                const asignationDetails = asigInRoom[index2]
                const {subject_id, id} = asignationDetails //Obtengo el subject e id, para mapearlo con el id de la asignation a modificar
                if (subject == subject_id) {
                    if ( await this.deleteHourScheduleAsignation(id, hora, dia, semana) == 1) {
                        break
                    } else {
                        // console.log('no se pudo borrar un horario que no existe:', hora, dia, semana )
                        continue
                    }
                }

            }
        }
        return
    }

    async createReservationRequestSchedule(day, hour, week, reservationId) {
        let query = `INSERT into reservation_request_schedule(reservation_request_id, day, hour, week) VALUES
                    (${reservationId}, '${day}', ${hour}, ${week})`;
        const createdSchedule = await pool.query(query);
        return createdSchedule;
    }

    async deleteRequest(id) {
        // Elimina primero el horario asignado a esa solicitud y luego la solicitud de reserva como tal
        let queryDeleteSchedule = `DELETE FROM reservation_request_schedule WHERE reservation_request_id = ${id}`;
        let queryDeleteRequest = `DELETE FROM reservation_request WHERE id = ${id}`;
        await pool.query(queryDeleteSchedule);
        const deletedRequest = await pool.query(queryDeleteRequest);
        return deletedRequest;
    }

    //  ********************* SERVICIOS DE ROOM REQUEST  *********************

    async createRoomRequest(room_id, userId, date) {
        const trimestre = await this.getActualTrim();      //Se obtiene el trimestre actual
        let queryChief = `SELECT chief, type from usuario where usuario.id='${userId}'`;
        const owner = await pool.query(queryChief);    //Obtenemos el jefe de laboratorio correspondiente       
        if (owner.rows[0].type != 3333 || room_id == undefined) {
            return null
        }
        let query = `INSERT into room_request(room_id, requested_id, owner_id, manager_id, trimester_id, date, status) VALUES
        ('${room_id}', 'labf','${owner.rows[0].chief}','${userId}','${trimestre.rows[0].id}','${date}', 'P')`;
        const createRoomRequest = await pool.query(query);
        return createRoomRequest;
    }

    async updateRoomRequest(id, status) {
        let query1 = `SELECT room.id from room join room_request on room_id=room.id WHERE room_request.id='${id}' and room.is_active='t'`;
        const verificacionRoom = await pool.query(query1); //Se verifica que el room a actualizar el estado no se encuentre previamente en la lista de room      
        if (verificacionRoom.rowCount > 0 && status == 'A') { //Si el rowCount del query es mayor a 0, es decir, ya existe la sala en room y ademas el admin desea colocar como
            return null; //aprobada la solicitud, entonces esta no pasa.
        } else {
            let query2 = `UPDATE room_request SET status= '${status}' WHERE id='${id}'`;
            const roomRequest_updated = await pool.query(query2);
            return roomRequest_updated;
        }
    }

    async getRoomRequest() {
        let query = `SELECT * FROM room_request WHERE status = 'P'`;
        const roomRequests = await pool.query(query);
        return roomRequests;
    }
    async getRoomRequestFromUser(userId) {

        let query = `SELECT * FROM room_request WHERE manager_id='${userId}'`;
        const requests = await pool.query(query);
        return requests || [];


    }

    //  ********************* SERVICIOS DE USUARIO  *********************

    async getUser(userId) {
        let query = `SELECT * FROM usuario WHERE id = '${userId}'`;
        const requestsUsers = await pool.query(query);
        return requestsUsers || [];
    }

    async getUsers() {
        let query = `SELECT * FROM usuario`;
        const requestsUsers = await pool.query(query);
        return requestsUsers || [];
    }

    async getAdminUsers() {
        let query = `SELECT * FROM usuario WHERE type = 3333`;
        const requestsUsers = await pool.query(query);
        return requestsUsers || [];
    }

    async getProfesor() {
        let query = `SELECT * FROM usuario WHERE type = 1111 or type = 2222`;
        const profesores = await pool.query(query);
        return profesores || [];
    }

    async registerUser(usbId, name, email, type, chief, clave) {

        const claveEncrypt = await auth.encryptPassword(clave);

        let query = `INSERT into usuario (id,name, email, type, is_active,chief, clave)
        values('${usbId}','${name}','${email}','${type}','t', '${chief}', '${claveEncrypt}')`;

        await pool.query(query);

        const token = await auth.createToken(usbId, type);

        return token;
    }
    async loginUser(usbId, clave) {
        let query = `SELECT id, clave, type from usuario where id='${usbId}'`;
        const login = await pool.query(query);
        if (login.rows < 1) {
            return 0;
        }
        const validPassword = await auth.comparePassword(clave, login.rows[0].clave);
        if (!validPassword) {
            return 1;
        }
        else {
            const token = await auth.createToken(login.rows[0].id, login.rows[0].type);
            return token;
        }

    }

    //  ********************* SERVICIOS DE MATERIA  *********************

    async getSubjects() {
        let query = `SELECT * FROM subject`;
        const subjects = await pool.query(query);
        return subjects || [];
    }

    //  ********************* SERVICIOS DE TRIMESTRE  *********************

    async getEndDate(trimesterId) {
        let query = `SELECT finish FROM trimester WHERE id = '${trimesterId}'`;
        const endDate = await pool.query(query);
        return endDate || [];
    }


    //  ********************* SERVICIOS DE HORARIO  *********************

    async getSalaHorasOcupadasTodas(salaId) {
        const trimestre = await this.getActualTrim();      //Se obtiene el trimestre actual
        console.log(salaId,trimestre.rows[0].id)
        let query = `SELECT subject_id, day, hour FROM asignation JOIN asig_schedule ON asignation.id = asig_schedule.asignation_id WHERE room_id = '${salaId}' AND trimester_id = '${trimestre.rows[0].id}' GROUP BY subject_id, day, hour`;
        const request = await pool.query(query);
        // console.log(request.rows)
        return request || [];
    }
    async getSalaHorasOcupadasPares(salaId) {
        const trimestre = await this.getActualTrim();      //Se obtiene el trimestre actual
        let query = `SELECT subject_id, day, hour FROM asignation JOIN asig_schedule ON asignation.id = asig_schedule.asignation_id WHERE room_id = '${salaId}' AND trimester_id = '${trimestre.rows[0].id}' AND (( week % 2 ) = 0) GROUP BY subject_id, day, hour`;
        const request = await pool.query(query);
        return request || [];
    }
    async getSalaHorasOcupadasImpares(salaId) {
        const trimestre = await this.getActualTrim();      //Se obtiene el trimestre actual
        let query = `SELECT subject_id, day, hour FROM asignation JOIN asig_schedule ON asignation.id = asig_schedule.asignation_id WHERE room_id = '${salaId}' AND trimester_id = '${trimestre.rows[0].id}' AND (( week % 2 ) = 1) GROUP BY subject_id, day, hour`;
        const request = await pool.query(query);
        return request || [];
    }

    //***************** Metricas ***************************************
    async usoDesdeFecha(room_id, fechaInicio){

        let query = `SELECT sum(quantity) from reservation_request WHERE status='A' and send_time> '${fechaInicio}' and room_id='${room_id}'`;
        const request= await pool.query(query);
        return request.rows[0].sum;
    }
    async numeroDeReservas(modo){
        let query;
        if(modo=='T'){
            query = `SELECT count(id) from reservation_request`;
        }
        else{
            query = `SELECT count(id) from reservation_request WHERE status='${modo}'`;
        }
        const request = await pool.query(query);
        return request.rows[0].count;
    }
    async variacionItems(room_id, trimestreInicio, trimestreFinal){
        let query = `SELECT id, start from trimester where trimester.id='${trimestreInicio}' or trimester.id='${trimestreFinal}'`;
        let result = await pool.query(query);
        if(result.rowCount<=1){
            return 0;
        }
        query = `SELECT trimester_id, room_id, item_id, name, description, quantity from room_item JOIN item on item.id=item_id JOIN trimester on trimester.id=trimester_id 
        WHERE start BETWEEN (SELECT start from trimester WHERE trimester.id='${trimestreInicio}')
        and (SELECT start from trimester WHERE trimester.id='${trimestreFinal}') and room_id='${room_id}' ORDER BY item_id, start`;
        result= await pool.query(query);
        return result || [];
    }
}
module.exports = ReservacService