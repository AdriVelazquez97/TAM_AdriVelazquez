const boom = require('boom');
const  { checkIfExists } = require('../helper')

module.exports = async (mongoService, req, res, next) => {
    const { user } = req
    const queryCheck = {
        email: user.email,
    }

    const userCollection = mongoService.collection('users')
    const userExists = await checkIfExists(queryCheck, userCollection )

    if(!userExists){
        return res.json(boom.forbidden('User not found'))
    }

    if(!user.admin){
        return res.json(boom.unauthorized('Not have permissions'))
    }
    
    next();
}