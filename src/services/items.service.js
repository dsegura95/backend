const pool = require('../data_base/pgConnect');
const RoomsService = require('./rooms.service');
const roomsService = new RoomsService();

class ItemsService {
  async getItems() {
    let query = 'SELECT * FROM item';
    const items = await pool.query(query);
    return items || [];
  }

  async getItemsNoOwned(roomId) {
    let arrayOfItems = [];
    const idsItems = await roomsService.getSalaItems(roomId);
    // Obtenemos todos los items perteneciente a la sala y guardamos sus ids en un arreglo
    if (idsItems.rowCount > 0) {
      for (let index = 0; index < idsItems.rowCount; index++) {
        const element = idsItems.rows[index];
        arrayOfItems.push(element.id);
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
}

module.exports = ItemsService;
