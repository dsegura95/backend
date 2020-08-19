const pool = require('../data_base/pgConnect');

class SubjectsService {
  async getSubjects() {
    let query = `SELECT * FROM subject`;
    const subjects = await pool.query(query);
    return subjects || [];
  }
}

module.exports = SubjectsService;
