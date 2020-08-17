const ItemsService = require('../services/items.service');
const itemsService = new ItemsService();
/*
    Rules To Api Rest
    status code 200 = means everything its ok
    status code 201 = means the object/item was created succesfull
    status code 400 = means bad request from the input
    status code 404 = means bad request url
*/

/*
    Auxiliar functions
*/

// Check if the item name is valid
function validName(name) {
  if (typeof name == 'string' && name != '') {
    return true;
  } else {
    return false;
  }
}

// Check if the item description is null
function checkDescription(description) {
  if (description == null) {
    description = 'No hay descripcion';
    return description;
  } else {
    return description;
  }
}

//Check if the item exists
async function checkItem(id) {
  const item = await itemsService.getItem(id);
  if (item.rowCount != 1) {
    return false;
  } else {
    return true;
  }
}

/*
    Controller
*/

class itemController {
  // GET all items
  async allItems(req, res, next) {
    // console.log(req.userId, req.userType) Testing jwt
    try {
      const items = await itemsService.getItems();
      if (items.rowCount > 0) {
        res.status(200).send(items.rows);
      } else {
        res.status(200).json({ message: 'No hay items disponibles' });
      }
    } catch (error) {
      next(error);
    }
  }

  // GET one item from id
  async specificItem(req, res, next) {
    try {
      const id = req.params.itemId;
      const item = await itemsService.getItem(id);
      if (item.rowCount == 1) {
        res.status(200).send(item.rows);
      } else {
        res.status(400).json({ message: 'No existe dicho Item' });
      }
    } catch (err) {
      next(err);
    }
  }

  // POST create one item
  async createItem(req, res, next) {
    let { name, description } = req.body;
    description = checkDescription(description);
    if (validName(name)) {
      try {
        await itemsService.createItem(name, description);
        res.status(201).json({ message: `Item ${name} creado` });
      } catch (err) {
        next(err);
      }
    } else {
      res
        .status(400)
        .json({ message: `Debe introducir nombre valido para el objecto` });
    }
  }

  // PUT update an item
  async updateItem(req, res, next) {
    let { name, description } = req.body;
    const id = req.params.itemId;
    description = checkDescription(description);
    if (await checkItem(id)) {
      if (validName(name)) {
        try {
          await itemsService.updateItem(id, name, description);
          res.status(200).json({ message: `Item ${id} actualizado` });
        } catch (err) {
          next(err);
        }
      } else {
        res
          .status(400)
          .json({ message: `Debe introducir nombre valido para el objecto` });
      }
    } else {
      res
        .status(400)
        .json({ message: `El item id ${id} a actualizar no existe` });
    }
  }

  // DELETE delete an item
  async deleteItem(req, res, next) {
    const id = req.params.itemId;
    if (await checkItem(id)) {
      try {
        await itemsService.deleteItem(id);
        res
          .status(200)
          .json({ message: `Item Id: ${id} Eliminado correctamente` });
      } catch (err) {
        next(err);
      }
    } else {
      res
        .status(400)
        .json({ message: `El item id ${id} a eliminar no existe` });
    }
  }
}

module.exports = itemController;
