var express = require('express');
var router = express.Router();
var questionController = require('../Controllers/QuestionController');

router.post('/delete', questionController.delete);

module.exports = router;