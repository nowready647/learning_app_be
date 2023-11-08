const userHasSolvedQuiz = require('../Models/UserHasSolvedQuiz');


exports.add = function(req, res) {
    userHasSolvedQuiz.create({
        id_user: req.body.id_user,
        id_quiz: req.body.id_quiz,
        points: req.body.points
    }).then(result => {
        return res.status(200).json({ ok: true });
    }).catch(error => {
        return res.status(404).send({ error: error.message });
    }) 
}