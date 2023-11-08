var express = require('express');
var router = express.Router();
var choiceController = require('../Controllers/ChoiceController');

router.post('/delete', choiceController.delete);

module.exports = router;