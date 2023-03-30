const JWT = require("jsonwebtoken");
require('dotenv/config');
const JWT_KEY = process.env.JWT_KEY;

const authorization = (req, res, next) => {

    const token = req.header('authToken') ;
    if (!token) {
        res.status(401).send({error: "Access Denied"})
    }
    try {
        const data = JWT.verify(token, JWT_KEY);
        req.user = data.user;
        next();
    } catch (error) {
        res.status(401).send({error: "Access Denied"})
    }
}

module.exports = authorization;