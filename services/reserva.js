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
        let query = `INSERT INTO item (name, description) VALUES ('${name}','${description}'`;
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

    //  ************************ SERVICIOS DE LAS SALAS  ***********************

    //  ************************ GET  **********************

    async getSalas() {
        let query = 'SELECT * FROM room';
        const items = await pool.query(query);
        return items || [];
    }

    async getSala(id) {
        let query = `SELECT * FROM room WHERE id = '${id}'`;
        const sala = await pool.query(query);
        return sala || [];
    }

    async getSalaItems(id) {
        //const TRIM_ACTUAL = await this.getActualTrim()
        let sql = `SELECT r.quantity, i.name, i.description FROM room_item AS r INNER JOIN item AS i ON i.id = r.item_id WHERE room_id = '${id}'`;
        const itemsSala = await pool.query(sql);
        return itemsSala || [];
    }

    async getAdminSalas(id) {
        const sql = `SELECT * FROM room WHERE manager_id = '${id}'`;
        const adminSalas = await pool.query(sql);
        return adminSalas || [];
    }

    //  ************************ Post  ***********************

    async createSala(name, description) {
        let query = `INSERT INTO room (name, description) VALUES ('${name}','${description}'`;
        const createItemId = await pool.query(query);
        return createItemId;
    }

    //  ************************ Put  ***********************


    async updateSala(id, name, description) {
        let query = `UPDATE room SET name = '${name}', description = '${description}' WHERE id = ${id}`;
        const updateItem = await pool.query(query);
        return updateItem;
    }

    //  ************************ Delete  ***********************

    async deleteSala(id) {
        let query = `DELETE FROM room WHERE id = '${id}'`;
        const deleteItem = await pool.query(query);
        return deleteItem;
    }


    //  ********************* SERVICIOS DE TRIMESTRE  *********************

    async getActualTrim() {
        const sql = 'SELECT id FROM trimester ORDER BY id DESC LIMIT 1';
        const trim = await pool.query(sql);
        return trim || [];
    }

    //  ********************* SERVICIOS DE SOLICITUDES  *********************

    async getResquetUser(userId) {
        let query = `SELECT * FROM reservation_request JOIN Reservation_request_schedule 
        ON id WHERE requester_id = '${userId}'`;
        const requestsUsers = await pool.query(query);
        return requestsUsers || [];
    }

    async getResquests(labId) {
        let query = `SELECT reservation_request.id, requester_id, room_id, subject_id, trimester_id, reason,
        material_needed, status FROM reservation_request JOIN room ON reservation_request.room_id = room.id 
        JOIN usuario ON usuario.id = room.manager_id WHERE manager_id = '${labId}'`;
        const requests = await pool.query(query);
        return requests || [];
    }

    //  ********************* SERVICIOS DE USUARIOS  *********************

    async getUsers() {
        let query = `SELECT * FROM usuario`;
        const users = await pool.query(query);
        return users || [];
    }

    async getUser(id) {
        let query = `SELECT * FROM usuario WHERE id = '${id}'`;
        const user = await pool.query(query);
        return user || [];
    }


}

module.exports = ReservacService