const ItemsService = require('../services/items.service');
const RoomsService = require('../services/rooms.service');
const roomsService = new RoomsService();
const itemsService = new ItemsService();

/* Images modules */
const fs = require('fs');
const path = require('path');

/*
    Rules To Api Rest
    status code 200 = means everything its ok
    status code 201 = means the object/item was created succesfull
    status code 400 = means bad request from the input
    status code 404 = means bad request url
    status code 500 = means something explote on the bd
*/

/*
    Auxiliar functions
*/

// Check if quantity is valid
function validQuantity(quantity) {
  if (quantity < 0 || isNaN(quantity)) {
    return false;
  } else {
    return true;
  }
}

// Check if item exist in the db
async function itemExists(itemId) {
  const item = await itemsService.getItem(itemId);
  if (item.rowCount == 1) {
    return true;
  } else {
    return false;
  }
}

/*
    Controller
*/
class SalaController {
  // GET all rooms
  async allRooms(req, res, next) {
    try {
      const salas = await roomsService.getSalas();
      res.status(200).send(salas.rows);
    } catch (err) {
      res.status(500).json({ error: `Hubo un error en el servidor` });
      next(err);
    }
  }

  // GET one specific room
  async specificRoom(req, res, next) {
    const { salaId } = req.params;
    try {
      const sala = await roomsService.getSala(salaId);
      if (sala.rowCount == 1) {
        res.status(200).send(sala.rows);
      } else {
        res.status(404).json({ message: `No existe la sala ${salaId}` });
      }
    } catch (err) {
      res.status(500).json({ error: `Hubo un error en el servidor` });
      next(err);
    }
  }

  // GET all rooms owned by one admin
  async adminRooms(req, res, next) {
    const userId = req.params.userId;
    try {
      const adminSalas = await roomsService.getAdminSalas(userId);
      res.status(200).send(adminSalas.rows);
    } catch (err) {
      res.status(500).json({ error: `Hubo un error en el servidor` });
      next(err);
    }
  }

  // GET an image from one Room <CHECK>
  async getImageRoom(req, res, next) {
    const salaId = req.params.salaId;
    try {
      res.status(200).sendFile(
        path.join(__dirname + `/../media/${salaId}.jpg`),
        // si falla, por default deja la img default
        function(err) {
          if (err) {
            res
              .status(200)
              .sendFile(path.join(__dirname + `/../media/defaultImage.jpg`));
          }
        }
      );
    } catch (err) {
      res.status(500).json({ error: `Hubo un error en el servidor` });
      next(err);
    }
  }

  // POST upload a new room image
  async uploadRoomImage(req, res, next) {
    try {
      const salaId = req.params.salaId;
      const { picture } = req.body;
      let base64String = picture; // Not a real image
      // Remove header
      let base64Image = base64String.split(';base64,').pop();
      fs.writeFile(
        path.join(__dirname + `/../media/${salaId}.jpg`),
        base64Image,
        { encoding: 'base64' },
        function() {
          res.status(201).json({ message: `Imagen de ${salaId} Actualizada` });
        }
      );
    } catch (err) {
      res
        .status(500)
        .json({ error: `Hubo un error al tratar de cargar la imagen` });
      next(err);
    }
  }

  // UPDATE info room: name, status, description
  async updateRoom(req, res, next) {
    const { name, description, is_active } = req.body;
    const id = req.params.salaId;
    try {
      let change = await roomsService.updateSala(
        id,
        name,
        description,
        is_active
      );
      if (change == 1) {
        res.status(200).json({ message: 'Sala Actualizada' });
      } else if (change == 0) {
        res.status(403).json({ error: 'Update Invalido' });
      } else if (change == -1) {
        res.status(403).json({ error: 'Hay reservas asignadas a esta sala' });
      }
    } catch (err) {
      res
        .status(500)
        .json({ error: `Hubo un error al momento de actualizar la sala` });
      next(err);
    }
  }

  // POST create a room
  async createRoom(req, res, next) {
    const {
      id,
      name,
      owner_id,
      manager_id,
      is_active,
      description,
      first_used
    } = req.body;
    try {
      await roomsService.createSala(
        id,
        name,
        owner_id,
        manager_id,
        is_active,
        description,
        first_used
      );
      res.status(201).json({ message: `Sala ${id} Creada` });
    } catch (err) {
      res
        .status(500)
        .json({ error: `Hubo un error al momento de crear la sala` });
      next(err);
    }
  }

  // GET room items
  async getRoomItems(req, res, next) {
    const salaId = req.params.salaId;
    try {
      const salaItems = await roomsService.getSalaItems(salaId);
      res.status(200).send(salaItems.rows);
    } catch (err) {
      console.log(err);
      res.status(500).json({ error: `Hubo un error en el servidor` });
      next(err);
    }
  }

  // GET all items that dont have a room
  async itemsNoOwned(req, res, next) {
    const roomId = req.params.roomId;
    try {
      const itemsNoOwned = await itemsService.getItemsNoOwned(roomId);
      res.status(200).send(itemsNoOwned.rows);
    } catch (err) {
      res.status(500).json({ error: `Hubo un error en el servidor` });
      next(err);
    }
  }

  // DELETE room Items
  async deleteRoomItem(req, res, next) {
    const id = req.params.itemId;
    const salaId = req.params.salaId;
    if (!(await itemExists(id))) {
      res.status(400).json({ error: 'El item no existe' });
    }
    try {
      await roomsService.deleteSalaItem(id, salaId);
      const salaItems = await roomsService.getSalaItems(salaId);
      // David pidio que retornara los items actualizados
      res.status(200).send(salaItems.rows);
    } catch (err) {
      res
        .status(500)
        .json({ error: `Hubo un error al momento de eliminar el item` });
      next(err);
    }
  }

  // UPDATE room items quantity
  async updateRoomItems(req, res, next) {
    const { quantity } = req.body;
    const room_id = req.params.salaId;
    const item_id = req.params.itemId;
    if (!(await itemExists(item_id))) {
      res.status(400).json({ error: 'El item no existe' });
    }
    if (!validQuantity(quantity)) {
      res.status(400).json({
        message: `No se aceptan valores negativos o invalidos en la cantidad`
      });
    }
    try {
      await roomsService.updateSalaItem(room_id, item_id, quantity);
      res.status(200).json({ message: `Item actualizado en Sala ${room_id}` });
    } catch (err) {
      res.status(500).json({
        error: `Hubo un error con los datos dados al momento de actualizar`
      });
      next(err);
    }
  }

  // POST add room item
  async addRoomItem(req, res, next) {
    const { quantity } = req.body;
    const room_id = req.params.salaId;
    const item_id = req.params.itemId;
    // Como los items ya existe, se verifica si el que se va a agregar existe
    if (!(await itemExists(item_id))) {
      res.status(400).json({ error: 'El item no existe' });
    }
    if (!validQuantity(quantity)) {
      res.status(400).json({
        message: `No se aceptan valores negativos o invalidos en la cantidad`
      });
    }
    try {
      await roomsService.createSalaItem(room_id, item_id, quantity);
      res
        .status(201)
        .json({ message: `${quantity} items asignados a Sala ${room_id}` });
    } catch (err) {
      res.status(500).json({
        error: `Hubo un error con los datos dados al momento de actualizar`
      });
      next(err);
    }
  }
}

module.exports = SalaController;
