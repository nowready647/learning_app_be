const { DataTypes } = require('sequelize');

const sequelize = require('../config');

const Message = sequelize.define('message', {
    id_question: {
        type: DataTypes.INTEGER,
        allowNull: true
    },
    id_creator: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false
    },
    content: {
        type: DataTypes.STRING,
        allowNull: false
    },
    solved: {
        type: DataTypes.TINYINT,
        allowNull: false
    },
    date_add: {
        type: DataTypes.DATE,
        allowNull: true
    }
}, {
    freezeTableName: true,
    timestamps: false
});

Message.belongsTo(Message, { foreignKey: 'id_question' });
Message.hasMany(Message, { foreignKey: 'id_question', as: 'answers' });

module.exports = Message;