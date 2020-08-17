const pool = require('../data_base/pgConnect');

class MetricsService {
  async usoDesdeFecha(room_id, fechaInicio) {
    let query = `SELECT sum(quantity) from reservation_request WHERE status='A' and send_time> '${fechaInicio}' and room_id='${room_id}'`;
    const request = await pool.query(query);
    return request.rows[0].sum;
  }
  async numeroDeReservas(modo) {
    let query;
    if (modo == 'T') {
      query = `SELECT count(id) from reservation_request`;
    } else {
      query = `SELECT count(id) from reservation_request WHERE status='${modo}'`;
    }
    const request = await pool.query(query);
    return request.rows[0].count;
  }
  async variacionItems(room_id, trimestreInicio, trimestreFinal) {
    let query = `SELECT id, start from trimester where trimester.id='${trimestreInicio}' or trimester.id='${trimestreFinal}'`;
    let result = await pool.query(query);
    if (result.rowCount <= 1) {
      return 0;
    }
    query = `SELECT trimester_id, room_id, item_id, name, description, quantity from room_item JOIN item on item.id=item_id JOIN trimester on trimester.id=trimester_id 
        WHERE start BETWEEN (SELECT start from trimester WHERE trimester.id='${trimestreInicio}')
        and (SELECT start from trimester WHERE trimester.id='${trimestreFinal}') and room_id='${room_id}' ORDER BY item_id, start`;
    result = await pool.query(query);
    return result || [];
  }
}
module.exports = MetricsService;
