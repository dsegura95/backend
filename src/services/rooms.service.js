const pool = require('../data_base/pgConnect');
const TrimestersService = require('./trimesters.service');
const trimestersService = new TrimestersService();

class RoomsService {
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

  async getSalaItemsByTrim(id, trimId) {
    let sql = `SELECT i.id, i.name, i.description, r.quantity FROM room_item AS r INNER JOIN item AS i ON i.id = r.item_id WHERE room_id = '${id}' AND trimester_id = '${trimId}'`;
    const itemsSala = await pool.query(sql);
    return itemsSala || [];
  }

  async getSalaItems(id) {
    let actualTrimId = await trimestersService.getActualTrim();
    const values = [id, actualTrimId.rows[0].id];
    let query = `SELECT i.id, i.name, i.description, r.quantity FROM room_item AS r INNER JOIN item AS i ON i.id = r.item_id WHERE room_id = $1 AND trimester_id = $2`;
    const itemsSala = await pool.query(query, values);
    return itemsSala || [];
  }

  async deleteSalaItem(id, salaId) {
    let actualTrimId = await trimestersService.getActualTrim();
    const values = [salaId, id, actualTrimId.rows[0].id];
    let query = `DELETE FROM room_item AS r WHERE r.room_id = $1 AND r.item_id = $2 AND r.trimester_id = $3`;
    await pool.query(query, values);
    return;
  }

  async updateSalaItem(room_id, item_id, quantity) {
    let trimester_id = await trimestersService.getActualTrim();
    const values = [quantity, room_id, trimester_id.rows[0].id, item_id];
    let query = `UPDATE room_item SET quantity = $1 WHERE room_id = $2 AND trimester_id = $3 AND item_id = $4`;
    const updateItem = await pool.query(query, values);
    return updateItem;
  }

  async createSalaItem(room_id, item_id, quantity) {
    let trimester_id = await trimestersService.getActualTrim();
    const values = [room_id, trimester_id.rows[0].id, item_id, quantity];
    let query = `INSERT INTO room_item (room_id, trimester_id, item_id, quantity) VALUES ($1, $2 , $3, $4)`;
    const createItemId = await pool.query(query, values);
    return createItemId;
  }

  async getAdminSalas(id) {
    const sql = `SELECT * FROM room WHERE manager_id = '${id}'`;
    const adminSalas = await pool.query(sql);
    return adminSalas || [];
  }

  async createSala(
    id,
    name,
    owner_id,
    manager_id,
    is_active,
    description,
    first_used
  ) {
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
    if (is_active == 'true') {
      query = `UPDATE room SET is_active = '${is_active}' WHERE id = '${id}'`;
      await pool.query(query);
      change = 1;
    }
    if (is_active == 'false') {
      let howManyAsig = await trimestersService.getReservationByRoom(id);
      if (howManyAsig.rowCount == 0) {
        query = `UPDATE room SET is_active = '${is_active}' WHERE id = '${id}'`;
        change = await pool.query(query);
        change = 1;
      } else {
        change = -1;
      }
    }
    return change;
  }

  async deleteSala(id) {
    let query = `DELETE FROM room WHERE id = '${id}'`;
    const deleteItem = await pool.query(query);
    return deleteItem;
  }
}

module.exports = RoomsService;
