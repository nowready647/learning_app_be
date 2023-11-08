const seq = require('../config');
const Quiz = require('../Models/Quiz');
const User = require('../Models/User');
const Question = require('../Models/Question');
const Choice = require('../Models/Choice');
const UserHasSolvedQuiz = require('../Models/UserHasSolvedQuiz');
const { Op } = require('sequelize');

exports.getList = async function (req, res) {
    const userId = req.body.id_user;
    const limit = 20;
    const offset = req.body.page * limit;

    const filters = req.body.filters;
    filters.inactive = null;
    Object.keys(filters).forEach((k) => filters[k] == "" && delete filters[k]);

    if (filters.title) {
        filters.title = {[Op.like]: '%' + filters.title + '%'};
    }

    let creator = {};
    if (filters.creator) {
        creator = {nick : {[Op.like]: '%' + filters.creator + '%'}};
        Object.keys(filters).forEach((k) => k == 'creator' && delete filters[k]);
    }

    const quizList = await Quiz.findAll({ 
        where: filters, 
        include: [{ model: User, where: creator }, { model: Question, where: { inactive: null} }], 
        limit: limit, 
        offset: offset}
    );

    const data = await Promise.all(
        quizList.map(async (row) => {
            const hasSolved = await UserHasSolvedQuiz.findAll({ where: { id_user: userId, id_quiz: row.id } });
            row.dataValues.solved = hasSolved.length > 0;
            row.dataValues.questionsCount = row.questions.length;
            if (row.dataValues.solved) {
                row.dataValues.points = hasSolved[hasSolved.length - 1].points;
            }
            return row;
        })
    )
    return res.send({ error: false, body: data });
}
    

exports.add = async function (req,res) {
    try {
        let values = req.body.quiz;
        values.question_count = values.questions.length;
        const quiz = await createOrUpdateQuiz(values);
        values.questions.forEach(async element => {
            const question = await createOrUpdateQuestion(element, quiz.id);
            element.choices.forEach(element => {
                createOrUpdateChoice(element, question.id)
            })
        });
        return res.status(200).json({ok:true});
    } catch(error) {
        return res.status(404).send(error.message);
    }
}

exports.edit = async function (req,res) {
    try {
        const values = req.body.quiz;
        values.question_count = values.questions.length;
        createOrUpdateQuiz(values);
        values.questions.forEach(async element => {
            const question = await createOrUpdateQuestion(element, values.id);
            element.choices.forEach(elem => {
                createOrUpdateChoice(elem, question.id)
            })
        });
        return res.status(200).json({ok:true});
    } catch(error) {
        return res.status(404).send(error.message);
    }
}

exports.find = function(req, res) {
        Quiz.findOne({ where: { id: req.body.id }, include: [ { model: Question, where: { inactive: null }, include: { model: Choice, where: { inactive: null } } } ]})
        .then(data => {
            return res.status(200).send({body: data});
        }).catch(error => {
            return res.status(404).send({body: error.message})
        });
    
}

exports.delete = function(req, res) {
    const idQuiz = req.body.id;
    try {
        Quiz.update(
            { inactive: new Date() },
            { where: { id: idQuiz } }
        );
        Question.update(
            { inactive: new Date() },
            { where: { id_quiz: idQuiz } }
        );
        deleteQuizChoices(idQuiz);
        return res.status(200).json({ success: true });
    } catch(error) {
        res.status(404).send(error.message)
    }
}


exports.getPopular = async function (req,res) {
    try {
        const topList = await Quiz.findAll({
            attributes: [
                'id',
                'title',
                'description',
                [seq.literal('(SELECT COUNT(*) FROM user_has_solved_quiz WHERE user_has_solved_quiz.id_quiz = quiz.id)'), 'count']
            ],
            order: [[seq.literal('count'), 'DESC']],
            limit: 3,
            where: { inactive: null }
        });
        return res.status(200).send({body: topList});
    } catch(error) {
        return res.status(404).send(error.message);
    }
}

const deleteQuizChoices = async function(quizId) {
    Quiz.findOne({ where: { id: quizId }, include: { model: Question, include: Choice  } }).then(data => {
        data.questions.forEach(elem => {
            Choice.update(
                { inactive: new Date() }, 
                { where: { id_question: elem.id } }
            )
        })
    })

}

const createOrUpdateQuestion = async function(element, quizId) {
    if (element.id) {
        return await Question.update({
            id_quiz: quizId,
            question: element.question,
            description: element.description,
            input_type: element.input_type
        }, {
            where: { id: element.id }
        })
    } else {
        return await Question.create({
            id_quiz: quizId,
            question: element.question,
            description: element.description,
            input_type: element.input_type
        })
    }
}

const createOrUpdateChoice = async function(element, questionId) {
    if (element.id) {
        return await Choice.update({
            id_question: questionId,
            description: element.description,
            is_correct: element.is_correct
        }, {
            where: { id: element.id }
        })
    } else {
        return await Choice.create({
            id_question: questionId,
            description: element.description,
            is_correct: element.is_correct
        })
    }
}

const createOrUpdateQuiz = async function(element) {
    if (element.id) {
       return await Quiz.update({
            title: element.title,
            description: element.description,
            id_creator: element.id_creator,
            question_count: element.question_count
        }, {
            where: { id: element.id } 
        })
    } else {
        return await Quiz.create({
            title: element.title,
            description: element.description,
            id_creator: element.id_creator,
            question_count: element.question_count
        })
    }
}
