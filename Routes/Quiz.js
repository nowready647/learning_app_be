var express = require('express');
var router = express.Router();
var quizController = require('../Controllers/QuizController')
var userHasSolvedQuizController = require('../Controllers/UserHasSolvedQuizController')

router.post('/', quizController.getList)

router.post('/add', quizController.add)

router.post('/find', quizController.find)

router.post('/delete', quizController.delete)

router.post('/edit', quizController.edit)

router.post('/solve', userHasSolvedQuizController.add)

router.get('/get-popular', quizController.getPopular)

module.exports = router;