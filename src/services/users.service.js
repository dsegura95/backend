const pool = require('../data_base/pgConnect');

// Se importan metodos de autenticacion
const Auth = require('../authentication/auth.js');
const auth = new Auth();

class UsersService {
  async getUser(userId) {
    let query = `SELECT * FROM usuario WHERE id = '${userId}'`;
    const requestsUsers = await pool.query(query);
    return requestsUsers || [];
  }

  async getUsers() {
    let query = `SELECT * FROM usuario`;
    const requestsUsers = await pool.query(query);
    return requestsUsers || [];
  }

  async getAdminUsers() {
    let query = `SELECT * FROM usuario WHERE type = 3333`;
    const requestsUsers = await pool.query(query);
    return requestsUsers || [];
  }

  async getProfesor() {
    let query = `SELECT * FROM usuario WHERE type = 1111 or type = 2222`;
    const profesores = await pool.query(query);
    return profesores || [];
  }

  async registerUser(usbId, name, email, type, chief, clave) {
    const claveEncrypt = await auth.encryptPassword(clave);

    let query = `INSERT into usuario (id,name, email, type, is_active,chief, clave)
        values('${usbId}', '${name}', '${email}', ${type}, 'true', '${chief}', '${claveEncrypt}')`;

    await pool.query(query);

    const token = await auth.createToken(usbId, type);

    return token;
  }

  async loginUser(usbId, clave) {
    let query = `SELECT id, clave, type from usuario where id='${usbId}'`;
    const login = await pool.query(query);
    const user = login.rows[0];
    if (login.rows < 1) {
      return 0;
    }
    const validPassword = await auth.comparePassword(
      clave,
      login.rows[0].clave
    );
    if (!validPassword) {
      return 1;
    } else {
      const token = await auth.createToken(user.id, user.type);
      return token;
    }
  }
}

module.exports = UsersService;
