const { DataTypes } = require('sequelize');

const sequelize = require('../config');

const AccessToken = sequelize.define('access_token', {
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
    access_token: {
        type: DataTypes.STRING,
        allowNull: false
    }
}, {
    freezeTableName: true,
    timestamps: false
});

module.exports = AccessToken;