const boom = require('boom')
const _ = require('lodash')
const { createQuerySearch } = require('../helper')

module.exports = (mongoCollection, defaultProperties) => async (req, res, next) => {
    const searchParams = _.get(req.body, 'searchParams', {})
    const skip = _.get(req.query, 'skip', defaultProperties.skip)
    const limit = _.get(req.query, 'limit', defaultProperties.limit)
    const skipParset = parseInt(skip);
    const limitParset = parseInt(limit);

    if(_.isNaN(skipParset) || _.isNaN(limitParset)){
        return res.json(boom.badData('Invalid values for skip and limit'))
    }

    const querySearch = createQuerySearch(searchParams)

    mongoCollection.count(querySearch)
    .then(count => {
        mongoCollection.find(querySearch).skip(skipParset).limit(limitParset).toArray()
        .then(result => {
            res.json({
                users: result,
                count
            })
        })
        .catch(err => console.log(err))
    }) 
    .catch((err) => console.log(err))
}