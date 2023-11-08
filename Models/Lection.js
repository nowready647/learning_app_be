const { DataTypes } = require('sequelize');

const sequelize = require('../config');

const Lection = sequelize.define('lection', {
    id_quiz: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = Lection;

