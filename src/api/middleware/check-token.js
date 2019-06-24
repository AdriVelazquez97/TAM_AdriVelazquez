const jwt = require('jsonwebtoken')
const _ = require('lodash')

module.exports = (req, res, next) => {
    const auth_token = req.get('auth_token')
    const { SEED } = process.env

    jwt.verify(auth_token, SEED, (err, decoded) =>{
        if(err){
            return res.status(401).json({
                msg: 'Invalid token'
            })
        }

        req.usuario = decoded.usuario; 
        next();
    })
}


