const pool = require('../data_base/pgConnect');
const TrimestersService = require('./trimesters.service');
const trimestersService = new TrimestersService();

class RoomRequestService {
  async createRoomRequest(room_id, userId, date) {
    const trimestre = await trimestersService.getActualTrim();
    const valuesChief = [userId];
    let queryChief = `SELECT chief, type from usuario where usuario.id=$1`;
    const owner = await pool.query(queryChief, valuesChief); //Obtenemos el jefe de laboratorio correspondiente
    if (owner.rows[0].type != 3333 || room_id == undefined) {
      return null;
    }
    const values = [
      room_id,
      owner.rows[0].chief,
      userId,
      trimestre.rows[0].id,
      date
    ];
    let query = `INSERT into room_request(room_id, requested_id, owner_id, manager_id, trimester_id, date, status) VALUES
        ($1, 'labf',$2, $3, $4, $5, 'P')`;
    const createRoomRequest = await pool.query(query, values);
    return createRoomRequest;
  }

  async updateRoomRequest(id, status) {
    let query1 = `SELECT room.id from room join room_request on room_id=room.id WHERE room_request.id='${id}' and room.is_active='t'`;
    const verificacionRoom = await pool.query(query1); //Se verifica que el room a actualizar el estado no se encuentre previamente en la lista de room
    if (verificacionRoom.rowCount > 0 && status == 'A') {
      //Si el rowCount del query es mayor a 0, es decir, ya existe la sala en room y ademas el admin desea colocar como
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
}

module.exports = RoomRequestService;
