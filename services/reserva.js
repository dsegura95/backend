const { Pool } = require('pg')

const pool = new Pool({
    host: 'localhost',
    user: 'postgres',
    password: '1234',
    database: 'reserva',
    port: '5432'
})

class ReservacService {

    async getItems() {
        const items = await pool.query('SELECT * FROM item');
        return items || [];
    }

    async getItem(id) {
        const item = await pool.query('SELECT * FROM item WHERE id = ($1)', [id]);
        return item || [];
    }

    async createItem(name) {
        const createItemId = await pool.query('INSERT INTO item (name) VALUES ($1)', [name]);
        return createItemId;
    }

    async updateItem(id, name) {
        const updateItem = await pool.query('UPDATE item SET name = $1 WHERE id = $2', [name, id]);
        return updateItem;
    }

    async deleteItem(id) {
        const deleteItem = await pool.query('DELETE FROM item WHERE id = ($1)', [id]);
        return deleteItem;
    }

    async getSalas() {
        const salas = await pool.query('SELECT * FROM salas');
        return salas || [];
    }

    async getSala() {
        const sala = await pool.query('SELECT * FROM item WHERE id=sala ');
        return sala || {};
    }

    async createSala() {
        const createSalaId = await pool.query('SELECT * FROM item');
        return createSalaId;
    }

    async deleteSala() {
        const deletedSalaId = await pool.query('SELECT * FROM item');
        return deletedSalaId || [];
    }
}


module.exports = ReservacService