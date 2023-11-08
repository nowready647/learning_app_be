var express = require('express');
var router = express.Router();
var messageController = require('../Controllers/MessageController');
const { route } = require('./User');

router.post('/', messageController.getList)

router.post('/add', messageController.add)

router.post('/find', messageController.find)

router.post('/solve', messageController.solve)

module.exports = router;