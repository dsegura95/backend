const { Pool } = require('pg')

//  ************************ ACCESO A BD POSTGRESQL  ***********************

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '1234',
    database: 'reserva',
    port: '5432'
})

//const ACTUAL_TRIM = pool.query('SELECT id FROM trimester ORDER BY id DESC LIMIT 1');

class ReservacService {

    //  ************************ SERVICIOS MODELO DE ITEM  ***********************

    async getItems() {
        let query = 'SELECT * FROM item';
        const items = await pool.query(query);
        return items || [];
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
        const deleteItem = await pool.query(query);
        return deleteItem;
    }

    //  ************************ SERVICIOS DE LAS SALA  ***********************

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
    async getSalaItems(id) {
        let actualTrimId = await this.getActualTrim();
        let sql = `SELECT r.quantity, i.name, i.description FROM room_item AS r INNER JOIN item AS i ON i.id = r.item_id WHERE room_id = '${id}' AND trimester_id = '${actualTrimId.rows[0].id}'`;
        const itemsSala = await pool.query(sql);
        return itemsSala || [];
    }

    async deleteSalaItem(id, salaId) {
        let actualTrimId = this.getActualTrim();
        let query = `DELETE FROM room_item AS r WHERE id = '${id}' AND room_id = '${salaId}' AND trimester_id = '${actualTrimId.rows[0].id}'`;
        const deleteItem = await pool.query(query);
        return deleteItem;
    }

    async updateSalaItem(room_id, item_id, quantity) {
        let trimester_id = this.getActualTrim();
        let query = `UPDATE room_item SET quantity = '${quantity}' WHERE room_id = '${room_id}' AND trimester_id = '${trimester_id.rows[0].id}' AND item_id = '${item_id}'`;
        const updateItem = await pool.query(query);
        return updateItem;
    }

    async createSalaItem(room_id, item_id, quantity) {
        let trimester_id = this.getActualTrim();
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
        let query = [];
        let change = [];
        
        if (name){
            query  = `UPDATE room SET name = '${name}' WHERE id = '${id}'`;
            change = await pool.query(query);
        }
        if (description){
            query  = `UPDATE room SET description = '${description}' WHERE id = '${id}'`;
            change = await pool.query(query);
        }
        if (is_active){

            query  = `UPDATE room SET is_active = '${is_active}' WHERE id = '${id}'`;
            change = await pool.query(query);
        }
        if (change != []){
            return change;
        }
        else{
            return change;
        }
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
        let strt = dates.rows[0].start
        let fnsh = dates.rows[0].finish

        if ((!start) && ( finish > strt)) {
            query = `UPDATE trimester SET finish = '${finish}' WHERE id = '${id}'`;
        }
        else if ((!finish) && (fnsh > start)) {
            query = `UPDATE trimester SET start = '${start}' WHERE id = '${id}'`;
        }
        else if (finish > start) {
            query = `UPDATE trimester SET start = '${start}', finish = '${finish}' WHERE id = '${id}'`;
        }
        else{
            return [];
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
        let query = `SELECT * FROM asignation WHERE room_id = '${roomId}'`;
        const request = await pool.query(query);
        return request || [];
    }

    async getReservationFromWeek(room, week) {
        let query = `SELECT subject_id, day, hour, week FROM asignation AS r JOIN asig_schedule AS s ON r.id = s.asignation_id WHERE week = ${week} AND room_id = '${room}'`;
        const request = await pool.query(query);
        return request || [];
    }

    // Crea la reserva y su horario a partir de la solicitud y el horario de solicitud
    async createReservation(room, subject_id, trimester_id, date, requestId) {
        let query = `INSERT INTO asignation (room_id, subject_id, trimester_id, date) VALUES ('${room}','${subject_id}','${trimester_id}','${date}') RETURNING id`;
        const createAsignation = await pool.query(query);
        const id = createAsignation.rows[0].id
        const request_schedule = await this.getScheduleFromRequest(requestId);
        for (let index = 0; index < request_schedule.rowCount ; index++) {
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


    async getScheduleFromRequest(solicitudId) {
        let query = `SELECT * FROM reservation_request_schedule AS horario JOIN reservation_request AS solicitud ON 
                     horario.reservation_request_id = solicitud.id WHERE reservation_request_id = ${solicitudId}`;
        const request = await pool.query(query);
        return request || [];
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
        let query = `SELECT * FROM reservation_request WHERE requester_id = '${userId}'`;
        const requestsUsers = await pool.query(query);
        return requestsUsers || [];
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

    //  ********************* SERVICIOS DE ROOM REQUEST  *********************

    async createRoomRequest(room_id, manager_id, date) {
        const trimestre = await this.getActualTrim();      //Se obtiene el trimestre actual
        let queryChief = `SELECT chief from usuario where usuario.id='${manager_id}'`;
        const owner = await pool.query(queryChief);    //Obtenemos el jefe de laboratorio correspondiente
        let query = `INSERT into room_request(room_id, requested_id, owner_id, manager_id, trimester_id, date, status) VALUES
        ('${room_id}', 'labf','${owner.rows[0].chief}','${manager_id}','${trimestre.rows[0].id}','${date}', 'E')`;
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

    //  ********************* SERVICIOS DE ROOM REQUEST  *********************
    async getRoomRequest() {
        let query = `SELECT * FROM room_request`;
        const roomRequests = await pool.query(query);
        return roomRequests;
    }

    //  ********************* SERVICIOS DE HORARIO  *********************

    async getSalaHorasOcupadasTodas(salaId) {
        let query = `SELECT subject_id, day, hour FROM asignation JOIN asig_schedule ON asignation.id = asig_schedule.asignation_id WHERE room_id = '${salaId}' GROUP BY subject_id, day, hour`;
        const request = await pool.query(query);
        return request || [];
    }
    async getSalaHorasOcupadasPares(salaId) {
        let query = `SELECT subject_id, day, hour FROM asignation JOIN asig_schedule ON asignation.id = asig_schedule.asignation_id WHERE room_id = '${salaId}' AND (( week % 2 ) = 0) GROUP BY subject_id, day, hour`;
        const request = await pool.query(query);
        return request || [];
    }
    async getSalaHorasOcupadasImpares(salaId) {
        let query = `SELECT subject_id, day, hour FROM asignation JOIN asig_schedule ON asignation.id = asig_schedule.asignation_id WHERE room_id = '${salaId}' AND (( week % 2 ) = 1) GROUP BY subject_id, day, hour`;
        const request = await pool.query(query);
        return request || [];
    }
}



module.exports = ReservacService