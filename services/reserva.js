const { Pool } = require('pg')

    //  ************************ ACCESO A BD POSTGRESQL  ***********************

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '1234',
    database: 'reserva',
    port: '5432'
})

class ReservacService {

    //  ************************ SERVICIOS MODELO DE ITEM  ***********************

    async getItems() {
        const items = await pool.query('SELECT * FROM item');
        return items || [];
    }

    async getItem(id) {
        const item = await pool.query('SELECT * FROM item WHERE id = ($1)', [id]);
        return item || [];
    }

    async createItem(name, description) {
        const createItemId = await pool.query('INSERT INTO item (name, description) VALUES ($1, $2)', [name, description]);
        return createItemId;
    }

    async updateItem(id, name, description) {
        const updateItem = await pool.query('UPDATE item SET name = $1, description = $2 WHERE id = $3', [name, description, id]);
        return updateItem;
    }

    async deleteItem(id) {
        const deleteItem = await pool.query('DELETE FROM item WHERE id = ($1)', [id]);
        return deleteItem;
    }

    async createSala() {
        const createSalaId = await pool.query('SELECT * FROM item');
        return createSalaId;
    }

    async deleteSala() {
        const deletedSalaId = await pool.query('SELECT * FROM item');
        return deletedSalaId || [];
    }

    //  ************************ SERVICIOS DE LAS SALAS  ***********************

    async getSalas() {
        const items = await pool.query('SELECT * FROM room');
        return items || [];
    }

    async getSala(id) {
        const item = await pool.query('SELECT * FROM room WHERE id = ($1)', [id]);
        return item || [];
    }

    async getSalaItems(id) {
        console.log(id)
        const items = await pool.query(
        'SELECT r.quantity, i.name FROM room_item AS r INNER JOIN item AS i ON i.id = r.item_id WHERE room_id = ($1)',
        [id]);
        return items || [];
    }

    //  ********************* SERVICIOS DE LAS SOLICITUDES  *********************

}

module.exports = ReservacService