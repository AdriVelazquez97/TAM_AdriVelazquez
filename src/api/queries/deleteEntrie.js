const boom = require('boom')
const _ = require('lodash')
const { ObjectId } = require('mongodb')

const { checkIfExists } = require('../helper')

module.exports = (mongoCollection) => async (req, res, next) => {
    const { id } = req.params;

    if(id.length != 24){
        return res.json(boom.badRequest('Invalid filter'))
    }

    const filter = {
        _id: ObjectId(id)
    }

    const valideIfExists = await checkIfExists(filter, mongoCollection)
    
    if(!valideIfExists){
        return res.json(boom.badRequest('Entrie not found'))
    }

    mongoCollection.deleteOne(filter)
    .then(result => {
        res.json({
            result,
            msg: "Entrie deleted succesfully"
        })
    })
    .catch((err) => console.log(err))
}