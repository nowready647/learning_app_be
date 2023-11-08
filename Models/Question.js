const { DataTypes } = require('sequelize');

const sequelize = require('../config');
const Choice = require('./Choice');
const Quiz = require('./Quiz');

const Question = sequelize.define('question', {
    id_quiz: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    question: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    input_type: {
        type: DataTypes.ENUM('text', 'radio', 'select'),
        allowNull: true
    },
    description: {
        type: DataTypes.BOOLEAN,
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

Question.hasMany(Choice, {foreignKey: 'id_question'});
Choice.belongsTo(Question, {foreignKey: 'id_question'});

module.exports = Question;