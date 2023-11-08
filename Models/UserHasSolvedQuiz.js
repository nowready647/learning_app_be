const { DataTypes } = require('sequelize');
const sequelize = require('../config');
const Quiz = require('./Quiz');
const User = require('./User');



const UserHasSolvedQuiz = sequelize.define('user_has_solved_quiz', {
    id_user: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: User,
            key: 'id'
        }
    },
    id_quiz: {
        type: DataTypes.INTEGER,
        allowNull: false,
        references: {
            model: Quiz,
            key: 'id'
        }
    },
    points: {
        type: DataTypes.INTEGER,
        allowNull: false
    },
}, {
    freezeTableName: true,
    timestamps: false
});

Quiz.belongsToMany(User, { through: 'user_has_solved_quiz', foreignKey: 'id_user'});
User.belongsToMany(Quiz, { through: 'user_has_solved_quiz', foreignKey: 'id_quiz'});

Quiz.hasMany(UserHasSolvedQuiz, { foreignKey: 'id_quiz' });
UserHasSolvedQuiz.belongsTo(Quiz, { foreignKey: 'id_quiz' });

User.hasMany(UserHasSolvedQuiz, { foreignKey: 'id_user' });
UserHasSolvedQuiz.belongsTo(User, { foreignKey: 'id_user' });

module.exports = UserHasSolvedQuiz;