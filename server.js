const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const userRouter = require('./Routes/User')
const lectionRouter = require('./Routes/Lection')
const quizRouter = require('./Routes/Quiz')
const choiceRouter = require('./Routes/Choice')
const questionRouter = require('./Routes/Question')
const messageRouter = require('./Routes/Message')
const auth = require('./services/auth');
const sequelize = require('./config');
require('./constants');
const dotenv = require('dotenv');
const jwt = require('jsonwebtoken');
const cors = require('cors');

// app.use(function (req, res, next) {
//     res.setHeader('Access-Control-Allow-Origin', '*');
//     res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
//     res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,content-type');
//     res.setHeader('Access-Control-Allow-Credentials', true);
//     next();
// });

app.use(cors());

dotenv.config();


app.use(bodyParser.json());

app.use(bodyParser.urlencoded({
    extended: true
}));

sequelize.sync().then(() => {
  console.log('Database synchronized');
}).catch((error) => {
  console.error('Error syncing database:', error);
});

//auth
app.use('/message/add', auth.validateAccessToken);
app.use('/message/solve', auth.validateAccessToken);
app.use('/quiz/add', auth.validateAccessToken);
app.use('/quiz/delete', auth.validateAccessToken);
app.use('/quiz/edit', auth.validateAccessToken);


//routes
app.use('/user', userRouter);
app.use('/lection', lectionRouter);
app.use('/quiz', quizRouter);
app.use('/choice', choiceRouter);
app.use('/question', questionRouter);
app.use('/message', messageRouter);


app.listen(3000, function (req, res, next) {
    console.log('Node app is running on port 3000');
});
module.exports = app;