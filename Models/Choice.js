const { DataTypes } = require('sequelize');

const sequelize = require('../config');
const Question = require('./Question');

const Choice = sequelize.define('choice', {
    id_question: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    is_correct: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    inactive: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = Choice;