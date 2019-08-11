const boom = require('boom')
const _ = require('lodash')
const { ObjectId } = require('mongodb')

module.exports = (mongoCollection) => (req, res, next) => {
    const { id } = req.params;

    if(id.length != 24){
        return res.json(boom.badRequest('Invalid filter'))
    }

    const filter = {
        _id: ObjectId(id)
    }

    return mongoCollection.findOne(filter)
        .then((result) => {
            if(_.isEmpty(result)){
                return res.json(boom.badRequest('Entrie not found'))
            }

            res.json({
                customer: result
            })
        })
        .catch((err) => console.log(err))
}