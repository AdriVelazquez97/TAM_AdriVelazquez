const jwt = require('jsonwebtoken')
const _ = require('lodash')
const boom = require('boom')

module.exports = (req, res, next) => {
    const auth_token = req.get('auth_token')
    const { SEED } = process.env

    jwt.verify(auth_token, SEED, (err, decoded) =>{
        if(err){
            return res.status(401).json(boom.unauthorized("Token not valid"))
        }
        req.user = decoded.user; 
        next();
    })
}


