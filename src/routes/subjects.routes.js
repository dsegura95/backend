const { Router } = require('express');
const router = Router();

const SubjectsController = require('../controllers/subjects.controller');
const subjectController = new SubjectsController();

/*
 ***************************************************************
 ************************ SUBJECTS ROUTES ************************
 *******************************************************************
 */

/* [TESTED] Obtener todas las materias en el sistema */
router.get('/subjects', subjectController.getSubjects);

module.exports = router;
