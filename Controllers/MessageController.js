const { Op } = require('sequelize');
const seq = require('../config');
const Message = require('../Models/Message');
const User = require('../Models/User');
const { param } = require('../Routes/Message');

exports.getList = async function (req, res) {
    try {
        const offset = req.body.page * 20;
        const limit = 20;
        const filters = req.body.filters;

        filters.id_question = null;
        Object.keys(filters).forEach((k) => filters[k] == '' && filters[k] !== 0 && delete filters[k]);

        if (filters.title) {
            filters.title = {[Op.like]: '%' + filters.title + '%'};
        }

        let params = {
            attributes: [
                'id',
                'title',
                'content',
                'solved',
                'date_add',
                [seq.literal('(SELECT COUNT(*) FROM message as msg WHERE msg.id_question = message.id )'), 'count'],
            ],
            order: [['date_add', 'DESC']],
            where: filters,
            limit: req.body.limit ?? limit,
            offset: offset
        };

        if (req.body.id) {
            params.where.id_creator = req.body.id;
        }

        const list = await Message.findAll(params);
        
        return res.status(200).send(list);
    } catch (error) {
        return res.status(404).send(error.message);
    }
}

exports.add = async function (req, res) {
    try {
        const message = req.body.message;
        message.date_add = new Date();
        createOrUpdateMessage(message);
        return res.status(200).json({success: true});
    } catch (error) {
        return res.status(404).send(error.message);
    }
}

exports.find = function(req, res) {
    try {
        const message = Message.findOne({
            where: { id: req.body.id },
            include: [
              User,
              { model: Message, as: 'answers', where: { id_question: req.body.id }, required: false, include: [User] }
            ]
          });

        message.then((result) => {
            return res.send({ error: false, result });
        });
        message.catch((error) => {
            return res.send({ error: error, data: null, message: 'Empty query.' });
        });       
    } catch (error) {
       return res.send({ error: error, data: null, message: 'Empty query.' });
    }
    
};

exports.solve = function (req, res) {
    try {
        const message = req.body.message;
        message.solved = 1;
        createOrUpdateMessage(message);
        return res.status(200).json({success: true});
    } catch (error) {
        return res.status(404).send(error.message);
    }
};

const createOrUpdateMessage = async function(element) {
    if (element.id) {
       return await Message.update({
            title: element.title,
            content: element.content,
            id_creator: element.id_creator,
            id_question: element.id_question ? element.id_question : null,
            solved: element.solved,
        }, {
            where: { id: element.id } 
        })
    } else {
        return await Message.create({
            title: element.title,
            content: element.content,
            id_creator: element.id_creator,
            id_question: element.id_question ? element.id_question : null,
            solved: 0,
            date_add: element.date_add
        })
    }
}
