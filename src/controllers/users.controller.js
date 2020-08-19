const UsersService = require('../services/users.service');
const usersService = new UsersService();

// Validations
const boom = require('@hapi/boom');

/*
    Rules To Api Rest
    status code 200 = means everything its ok
    status code 201 = means the object/item was created succesfull
    status code 400 = means bad request from the input
    status code 404 = means bad request url
    status code 500 = means something explote on the bd
*/

/*
    Controller
*/
class UserController {
  // GET an User
  async getUser(req, res, next) {
    const userId = req.params.userId;
    try {
      const requestFromUser = await usersService.getUser(userId);
      if (requestFromUser.rows.length) {
        res.status(200).send(requestFromUser.rows);
      } else {
        res.json(boom.notFound('missing').output.payload);
      }
    } catch (err) {
      res.status(500).json({ error: `Hubo un error en el servidor` });
      next(err);
    }
  }

  // GET all users
  async getUsers(req, res, next) {
    try {
      const requestFromUser = await usersService.getUsers();
      if (requestFromUser.rows.length) {
        res.status(200).send(requestFromUser.rows);
      } else {
        res.json(boom.notFound('missing').output.payload);
      }
    } catch (err) {
      res.status(500).json({ error: `Hubo un error en el servidor` });
      next(err);
    }
  }

  // GET admins users
  async getAdmins(req, res, next) {
    try {
      const adminUsers = await usersService.getAdminUsers();
      if (adminUsers.rows.length) {
        res.status(200).send(adminUsers.rows);
      } else {
        res.json(boom.notFound('missing').output.payload);
      }
    } catch (err) {
      res.status(500).json({ error: `Hubo un error en el servidor` });
      next(err);
    }
  }

  // GET teachers and students (Standard user)
  async getStandardUsers(req, res, next) {
    try {
      const profesor = await usersService.getProfesor();
      res.status(200).send(profesor.rows);
    } catch (err) {
      res.status(500).json({ error: `Hubo un error en el servidor` });
      next(err);
    }
  }

  /*
   * Authetications for users
   */

  // POST registration user
  async signUp(req, res, next) {
    try {
      const { usbId, name, email, type, chief, clave } = req.body;
      const registro = await usersService.registerUser(
        usbId,
        name,
        email,
        type,
        chief,
        clave
      );
      res.json({ auth: true, token: registro });
    } catch (err) {
      res.status(500).json({ error: `Hubo un error en el servidor` });
      next(err);
    }
  }

  // POST loggin user
  async signIn(req, res, next) {
    try {
      const { usbId, clave } = req.body;
      const login = await usersService.loginUser(usbId, clave);
      if (login == 0) {
        res.status(404).send('Usuario no registrado en la base de datos');
      } else if (login == 1) {
        res.status(403).send('Clave incorrecta');
      } else {
        res.json({ auth: true, token: login });
      }
    } catch (err) {
      res.status(500).json({ error: `Hubo un error en el servidor` });
      next(err);
    }
  }
}

module.exports = UserController;
