const bcrypt = require('bcryptjs');
const User = require('../Models/User');
const AccessToken = require('../Models/AccessToken');
const jwt = require('jsonwebtoken');
const seq = require('../config');


exports.get_users = function(req, res) {
    User.findAll().then((result) => {
        return res.send({ error: false, data: result });
    }).catch((error) => {
        return res.send({ error: error, data: null, message: 'Empty query.' })
    });      
}

exports.find = function(req, res) {
    User.findOne({ where: { id: req.body.id } }).then((result) => {
        return res.send({ error: false, data: result });
    }).catch((error) => {
        return res.send({ error: error, data: null, message: 'Empty query.' })
    });
}

exports.userLogIn = function(req, res) {
    User.findOne({
        where: {
            email: req.body.params.email
        }
    }).then((user) => {
        if (user) {
            bcrypt.compare(req.body.params.password, user.password, function(error, result) {
                if (error) throw new Error(error.message);
                
                let data = {
                    time: Date(),
                    userId: user.id,
                }

                const token = jwt.sign(data, 'secretKey', {expiresIn: '2h'}); 
                AccessToken.create({id_user: user.id, access_token: token})


                res.setHeader("Access-Control-Expose-Headers", "AccessToken");
                res.setHeader('AccessToken', token);

                return res.send({error: error, data: { nick: user.nick, email: user.email, id: user.id }})
            });
        } else {
            return res.status(500).send({error: true, data: null, message: 'Empty query.'})
        }
    })        
}

exports.userRegister = function(req, res) {
    let password = req.body.params.password;
    let email = req.body.params.email;
    let userP = req.body.params.user;
    let saltRounds = 10;
    bcrypt.hash(password, saltRounds, function(error, hash) {
        User.findAll({
            where: {
                email: email
            }
        }).then((user) => {
            if (user.length != 0) {
                return res.status(404).send({error: true, data: null, message: 'Existing email.'})
            } else {
                User.create({email: email, nick: userP, password: hash}).then((result) => {
                    let data = {
                        time: Date(),
                        userId: result.dataValues.id,
                    }
                    const token = jwt.sign(data, 'secretKey', {expiresIn: '2h'}); 
                    AccessToken.create({id_user: result.dataValues.id, access_token: token})
                    result.dataValues.token = token;
                    return res.status(200).send({ error: false, result });
                }).catch((error) => {
                    return res.status(404).send({ error: error.message, data: null });
                })
            }
        }).catch((error) => {
            return res.send({error: error.message, data: null});
        })
    })
}

exports.getTopSolvers = async function(req, res) {
    try {
        const list = await seq.query('SELECT user.nick, (SUM(user_has_solved_quiz.points) / SUM(quiz.question_count)) * 100 AS success FROM user JOIN user_has_solved_quiz ON user.id = user_has_solved_quiz.id_user JOIN quiz ON quiz.id = user_has_solved_quiz.id_quiz GROUP BY user.nick ORDER BY success DESC LIMIT 6')
        
        return res.status(200).send(list[0]);
    } catch (error) {
        return res.status(404).send(error.message);
    }
}