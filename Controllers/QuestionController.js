const Question = require('../Models/Question');
const Choice = require('../Models/Choice');

exports.delete = function(req, res) {
    const idQuestion = req.body.id;
    try {
        Question.update(
            { inactive: new Date() }, 
            { where: { id: idQuestion } }
        )
        Choice.update(
            { inactive: new Date() }, 
            { where: { id_question: idQuestion } }
        )
        return res.json({success: true})
    } catch(error) {
        return res.status(404).send(error);
    }
}