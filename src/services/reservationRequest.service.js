const pool = require('../data_base/pgConnect');
const TrimestersService = require('./trimesters.service');
const trimestersService = new TrimestersService();

class ReservationRequestService {
  async getRequest(solicitudId) {
    let query = `SELECT * FROM reservation_request WHERE id = ${solicitudId}`;
    const request = await pool.query(query);
    return request || [];
  }

  async getScheduleFromRequestForPut(solicitudId) {
    let query = `SELECT * FROM reservation_request_schedule AS horario JOIN reservation_request AS solicitud ON
                     horario.reservation_request_id = solicitud.id WHERE reservation_request_id = ${solicitudId}`;
    const request = await pool.query(query);
    return request || [];
  }

  async getScheduleFromRequest(solicitudId) {
    let query = `SELECT * FROM reservation_request_schedule AS horario JOIN reservation_request AS solicitud ON
                     horario.reservation_request_id = solicitud.id WHERE reservation_request_id = ${solicitudId}`;
    const request = await pool.query(query);
    const content = request.rows;
    const response = {
      typeWeek: '-1',
      shedule: content
    };
    if (content.length == 1) {
      response.typeWeek = content[0].week.toString();
    } else if (content.length > 1) {
      const first = content[0];
      const second = content[1];
      if (first.hour == second.hour) {
        if (first.week % 2 == 0) {
          if (second.week % 2 == 0) {
            response.typeWeek = 'pares';
          } else {
            response.typeWeek = 'todas';
          }
        } else {
          if (second.week % 2 != 0) {
            response.typeWeek = 'impares';
          } else {
            response.typeWeek = 'todas';
          }
        }
      } else {
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
    const trimestre = await trimestersService.getActualTrim();
    const values = [userId, trimestre.rows[0].id];
    let query = `SELECT * FROM reservation_request WHERE requester_id = $1 AND trimester_id = $2`;
    const requestsUsers = await pool.query(query, values);
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

  // Crea la reserva y su horario a partir de la solicitud y el horario de solicitud
  async createReservation(room, subject_id, trimester_id, date, requestId) {
    let query = `INSERT INTO asignation (room_id, subject_id, trimester_id, date) VALUES ('${room}','${subject_id}','${trimester_id}','${date}') RETURNING id`;
    const createAsignation = await pool.query(query);
    const id = createAsignation.rows[0].id;
    const request_schedule = await this.getScheduleFromRequestForPut(requestId);
    for (let index = 0; index < request_schedule.rowCount; index++) {
      const element = request_schedule.rows[index];
      let values = [id, element.week, element.day, element.hour];
      let query1 = `INSERT INTO asig_schedule (asignation_id, week, day, hour) VALUES ($1,$2,$3,$4)`;
      await pool.query(query1, values);
    }
    return createAsignation;
  }

  async createReservationRequest(requester, subject, room, material, quantity) {
    const temp = await trimestersService.getActualTrim();
    const trimestreActual = temp.rows[0].id;
    const values = [
      requester,
      room,
      subject,
      trimestreActual,
      material,
      quantity
    ];
    let query = `INSERT into reservation_request(requester_id, room_id, subject_id, trimester_id, reason, material_needed, quantity, status) VALUES
                    ($1, $2, $3, $4, 'En espera', $5, $6, 'P') RETURNING id`;
    const createdRequest = await pool.query(query, values);
    const id = createdRequest.rows[0].id;
    return createdRequest, id;
  }

  async createReservationAsAdmin(requester, subject, room, material, quantity) {
    const temp = await trimestersService.getActualTrim();
    const trimestreActual = temp.rows[0].id;
    const values = [
      requester,
      room,
      subject,
      trimestreActual,
      material,
      quantity
    ];
    let query = `INSERT into reservation_request(requester_id, room_id, subject_id, trimester_id, reason, material_needed, quantity, status) VALUES
                    ($1, $2, $3, $4, 'Solicitud Aceptada', $5, $6, 'A') RETURNING id`;
    const createdRequest = await pool.query(query, values);
    const id = createdRequest.rows[0].id;
    return createdRequest, id;
  }

  // Funcion para insertar horario en una semana especifica (utilizar con loop todas, pares, impares, especifica)
  async insertarhorario(semana, horarios, id) {
    // Horario es el req.body completo, los horarios empiezan en el req.body[1]
    for (let index = 1; index < horarios.length; index++) {
      const horario = horarios[index];
      const { dia, hora } = horario;
      await this.createReservationRequestSchedule(dia, hora, semana, id);
    }
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
}

module.exports = ReservationRequestService;
