const jwt = require('jsonwebtoken');

exports.validateAccessToken = function (req, res, next) {
    if(req.url.includes('user')) {
        return next();
    }
  
    try {
        const token = req.headers.authorization;
        const result = jwt.verify(token, 'secretKey')
        if(result) {
            return next();
        }
    } catch (error) {
        return res.status(404).send({error: 'Invalid access token.', invalidToken: true})
    }
}