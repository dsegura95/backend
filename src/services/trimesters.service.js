const pool = require('../data_base/pgConnect');

class TrimestersService {
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
    let strt = dates.rows[0].start.toISOString().substring(0, 10);
    let fnsh = dates.rows[0].finish.toISOString().substring(0, 10);
    if (!start && finish > strt) {
      query = `UPDATE trimester SET finish = '${finish}' WHERE id = '${id}'`;
    } else if (!finish && fnsh > start) {
      query = `UPDATE trimester SET start = '${start}' WHERE id = '${id}'`;
    } else if (finish > start) {
      query = `UPDATE trimester SET start = '${start}', finish = '${finish}' WHERE id = '${id}'`;
    } else {
      return null;
    }
    const updateTrim = await pool.query(query);
    return updateTrim;
  }
}

module.exports = TrimestersService;
