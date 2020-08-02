const { Router } = require('express');
const router = Router();

const TrimesterController = require('../controllers/trimester.controller');
const trimesterController = new TrimesterController();

/*
 ***************************************************************
 ************************* TRIMESTER ROUTES **********************
 *******************************************************************
 */

/* DAEMON autoUpdate Trimester (used by script updateTrimester) */
router.get('/actualizarTrimestre', trimesterController.autoUpdateTrim);

/* [TESTED] GET actual trimester */
router.get('/trimestre/ultimo', trimesterController.getLastTrimester);

/* [TESTED] PUT update actual trimester  */
router.put('/trimestre/:Id', trimesterController.updateTrimester);

module.exports = router;
