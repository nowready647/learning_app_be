const { DataTypes } = require('sequelize');

const sequelize = require('../config');

const User = require('../Models/User');
const Question = require('./Question');
const Lection = require('./Lection');

const Quiz = sequelize.define('quiz', {
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    id_creator: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    question_count: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    inactive: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: false
});

Quiz.hasMany(Question, { foreignKey: 'id_quiz' });
Question.belongsTo(Quiz, { foreignKey: 'id_quiz' });

Quiz.hasMany(Lection, { foreignKey: 'id_quiz' });
Lection.belongsTo(Quiz, { foreignKey: 'id_quiz' });

module.exports = Quiz;