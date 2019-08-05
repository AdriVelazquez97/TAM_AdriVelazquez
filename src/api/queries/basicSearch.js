const boom = require('boom')
const _ = require('lodash')

module.exports = (mongoCollection, defaultProperties, hideProperties) => async (req, res, next) => {
    const skip = _.get(req.query, 'skip', defaultProperties.skip)
    const limit = _.get(req.query, 'limit', defaultProperties.limit)
    const skipParset = parseInt(skip);
    const limitParset = parseInt(limit);

    if(_.isNaN(skipParset) || _.isNaN(limitParset)){
        return res.json(boom.badData('Invalid values for skip and limit'))
    }

    return mongoCollection.count()
    .then(count => {
        mongoCollection.find({}, hideProperties).skip(skipParset).limit(limitParset).toArray()
        .then(result => {
            res.json({
                result,
                count
            })
        })
        .catch(err => console.log(err))
    }) 
    .catch((err) => console.log(err))
}