const boom = require('boom')
const _ = require('lodash')
const { ObjectId } = require('mongodb')

const { checkIfExists } = require('../helper')

module.exports = (mongoCollection) => async (req, res, next) => {

    const files = _.get(req, 'files', {})
    const id = _.get(req.params, 'id', '')

    if ( _.isEmpty(files) || Object.keys(files).length == 0) {
        return res.status(400).json(boom.badData('Picture not provided'))
    }

    if(id.length != 24){
        return res.json(boom.badRequest('Invalid filter'))
    }

    const filter = {
        _id: ObjectId(id)
    }

    const valideIfExists = await checkIfExists(filter, mongoCollection);

    if(!valideIfExists){
        return res.json(boom.badRequest('Entrie not found'))
    }

    const validExtensions = ['png', 'jpg', 'jpeg']
    const sampleFile = req.files.photo;
    const sampleFileSplited = sampleFile.name.split('.')
    const extension = sampleFileSplited[sampleFileSplited.length - 1]

    if(_.indexOf(validExtensions, extension) < 0){
        return res.json(boom.badData('File extension not valid'))  
    }

    const fillname = `${id}-${new Date().getMilliseconds()}.${extension}`;
    const routePhoto = `uploads/${req.collectionName}/${fillname}`;

    sampleFile.mv(routePhoto, (err) => {
        if (err)
        return res.status(500).json(boom.badRequest(err))
        
        const query = {
            $set: {
                photo: routePhoto
            },
        }
        
        mongoCollection.updateOne(filter, query)
            .then(result => {
                res.json({
                    result,
                    msg: "Photo updated succesfully"
                })
            })
            .catch((err) => console.log(err))
    });
}