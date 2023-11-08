var express = require('express');
var router = express.Router();
var lectionController = require('../Controllers/LectionController')

router.post('/find/', lectionController.findLection)

module.exports = router;