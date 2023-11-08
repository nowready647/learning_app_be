const { DataTypes } = require('sequelize');

const sequelize = require('../config');
const Quiz = require('./Quiz');
const Message = require('./Message');

const User = sequelize.define('user', {
    email: {
        type: DataTypes.STRING,
        allowNull: false
    },
    password: {
        type: DataTypes.STRING,
        allowNull: false
    },
    nick: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

Quiz.belongsTo(User, {foreignKey: 'id_creator'});
User.hasMany(Quiz, {foreignKey: 'id_creator'});

Message.belongsTo(User, {foreignKey: 'id_creator'});
User.hasMany(Message, {foreignKey: 'id_creator'});

module.exports = User;