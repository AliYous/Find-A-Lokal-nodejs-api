const jwt = require('jsonwebtoken');

//Middleware function that we can add to any route that should be private
module.exports = function (req, res, next){
    const token = req.header('auth-token');
    if(!token) return res.status(401).send('Access Denied');

    try {
        const verified = jwt.verify(token, process.env.TOKEN_SECRET);
        req.user = verified;
        next();
    }catch(err) {
        res.status(400).send('Invalid Token')
    }
}