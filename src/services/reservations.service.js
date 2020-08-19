const pool = require('../data_base/pgConnect');
const TrimestersService = require('./trimesters.service');
const trimestersService = new TrimestersService();

class ReservationsServices {
  async getScheduleFromAsignation(id) {
    let query = `SELECT * FROM asig_schedule WHERE asignation_id = ${id}`;
    const schedule = await pool.query(query);
    return schedule || [];
  }

  async getReservationByRoom(roomId) {
    let trimester_id = await trimestersService.getActualTrim();
    let query = `SELECT * FROM asignation WHERE room_id = '${roomId}' AND trimester_id = '${trimester_id.rows[0].id}'`;
    const request = await pool.query(query);
    return request || [];
  }

  async createReservationAsAdmin(requester, subject, room, material, quantity) {
    const temp = await trimestersService.getActualTrim();
    const trimestreActual = temp.rows[0].id;
    let query = `INSERT into reservation_request(requester_id, room_id, subject_id, trimester_id, reason, material_needed, quantity, status) VALUES
                    ('${requester}', '${room}', '${subject}', '${trimestreActual}', 'Solicitud Aceptada', '${material}', ${quantity}, 'A') RETURNING id`;
    const createdRequest = await pool.query(query);
    const id = createdRequest.rows[0].id;
    return createdRequest, id;
  }

  async deleteHourScheduleAsignation(asignationId, hour, day, week) {
    let query = `DELETE FROM asig_schedule WHERE asignation_id = ${asignationId} AND day = '${day}' AND hour = ${hour}
        AND week = ${week}`;
    const result = await pool.query(query);
    return result.rowCount;
  }

  // Funcion para eliminar horario (hora) en una semana especifica (utilizar con loop todas, pares, impares, especifica)
  async deleteScheduleFromAdmin(semana, horarios, room) {
    // Guardo los asignations que existen que existen en esa <room> para obtener los subjects y compararlos con los que se quieren eliminar
    let asigInRoom = await this.getReservationByRoom(room);
    asigInRoom = asigInRoom.rows;
    for (let index = 1; index < horarios.length; index++) {
      // Obtego el dia, hora, materia, del body (cada elemento req.body[x] con x > 0 representa una hora en Z dia )
      const horario = horarios[index];
      const { dia, hora, subject } = horario;
      // Itero sobre las asignaciones que hay en la sala para hallar cual es la que se quiere modificar
      for (let index2 = 0; index2 < asigInRoom.length; index2++) {
        const asignationDetails = asigInRoom[index2];
        const { subject_id, id } = asignationDetails; //Obtengo el subject e id, para mapearlo con el id de la asignation a modificar
        if (subject == subject_id) {
          if (
            (await this.deleteHourScheduleAsignation(id, hora, dia, semana)) ==
            1
          ) {
            break;
          } else {
            // console.log('no se pudo borrar un horario que no existe:', hora, dia, semana )
            continue;
          }
        }
      }
    }
    return;
  }

  async getReservationFromWeek(room, week) {
    let trimester_id = await trimestersService.getActualTrim();
    let query = `SELECT subject_id, day, hour, week FROM asignation AS r JOIN asig_schedule AS s ON r.id = s.asignation_id WHERE week = ${week} AND room_id = '${room}' AND trimester_id = '${trimester_id.rows[0].id}'`;
    const request = await pool.query(query);
    return request || [];
  }

  async getSalaHorasOcupadasTodas(salaId) {
    const trimestre = await trimestersService.getActualTrim(); //Se obtiene el trimestre actual
    let query = `SELECT subject_id, day, hour FROM asignation JOIN asig_schedule ON asignation.id = asig_schedule.asignation_id WHERE room_id = '${salaId}' AND trimester_id = '${trimestre.rows[0].id}' GROUP BY subject_id, day, hour`;
    const request = await pool.query(query);
    return request || [];
  }

  async getSalaHorasOcupadasPares(salaId) {
    const trimestre = await trimestersService.getActualTrim(); //Se obtiene el trimestre actual
    let query = `SELECT subject_id, day, hour FROM asignation JOIN asig_schedule ON asignation.id = asig_schedule.asignation_id WHERE room_id = '${salaId}' AND trimester_id = '${trimestre.rows[0].id}' AND (( week % 2 ) = 0) GROUP BY subject_id, day, hour`;
    const request = await pool.query(query);
    return request || [];
  }

  async getSalaHorasOcupadasImpares(salaId) {
    const trimestre = await trimestersService.getActualTrim(); //Se obtiene el trimestre actual
    let query = `SELECT subject_id, day, hour FROM asignation JOIN asig_schedule ON asignation.id = asig_schedule.asignation_id WHERE room_id = '${salaId}' AND trimester_id = '${trimestre.rows[0].id}' AND (( week % 2 ) = 1) GROUP BY subject_id, day, hour`;
    const request = await pool.query(query);
    return request || [];
  }
}

module.exports = ReservationsServices;
