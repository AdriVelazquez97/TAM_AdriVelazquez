const boom = require('boom')
const _ = require('lodash')
const { ObjectId } = require('mongodb')

const { checkdData, checkIfExists } = require('../helper')

module.exports = (mongoCollection) => async (req, res, next) => {
    const entrie  = _.get(req, 'body', {});
    console.log(entrie)
    const { id } = req.params;

    if(id.length != 24){
        return res.json(boom.badRequest('Invalid filter'))
    }
    
    const dataCheked = await checkdData(req.schemaType, entrie)

    if(!dataCheked || _.isEmpty(entrie)) { 
        return res.json(boom.badRequest('Invalid Data'))
    }

    const filter = {
        _id: ObjectId(id)
    }

    const valideIfExists = await checkIfExists(filter, mongoCollection)

    if(!valideIfExists){
        return res.json(boom.badRequest('Entrie not found'))
    }
    const query = {
        $set: entrie,
    }

    mongoCollection.updateOne(filter, query)
    .then(result => {
        res.json({
            result,
            msg: "Entrie updated succesfully"
        })
    })
    .catch((err) => console.log(err))
}