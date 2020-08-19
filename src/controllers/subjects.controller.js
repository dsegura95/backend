const SubjectsService = require('../services/subjects.service');
const subjectsService = new SubjectsService();

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
class SubjectsController {
  async getSubjects(req, res, next) {
    try {
      const subjects = await subjectsService.getSubjects();
      res.status(200).send(subjects.rows);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = SubjectsController;
