const express = require('express');
const boom = require('boom')
const _ = require('lodash')
const { ObjectId } = require('mongodb')

const { checkdData, checkIfExists, createQuerySearch } = require('../../helper')

const { basicSearch, searchById, searchWithFilters, postEntrie, putEntrie, deleteEntrie } = require('../../queries');

module.exports = (mongoService) => {

    const app = express();
    const userscollection = mongoService.collection('users')

    const hideProperties = {
        password: 0
    }
    const defaultProperties = {
        skip: 0,
        limit: 10
    }

    app.use(setPropertiesReq('User', 'userSchema'))

    app.get('/', basicSearch(userscollection, defaultProperties, hideProperties));
    app.get('/:id', searchById(userscollection, hideProperties));
    app.post('/search', searchWithFilters(userscollection, defaultProperties))

    app.post('/', postEntrie(userscollection));

    app.put('/:id', putEntrie(userscollection));

    app.delete('/:id', deleteEntrie(userscollection))

    app.put('/upload/:id', async(req, res, next) => {
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

        const valideIfExists = await checkIfExists(filter, userscollection);

        if(!valideIfExists){
            return res.json(boom.badRequest('User not found'))
        }

        const validExtensions = ['png', 'jpg', 'jpeg']
        const sampleFile = req.files.photo;
        const sampleFileSplited = sampleFile.name.split('.')
        const extension = sampleFileSplited[sampleFileSplited.length - 1]

        if(_.indexOf(validExtensions, extension) < 0){
            return res.json(boom.badData('File extension not valid'))  
        }

        const fillname = `${id}-${new Date().getMilliseconds()}.${extension}`;
        const routePhoto = `uploads/users/${fillname}`;

        sampleFile.mv(routePhoto, (err) => {
            if (err)
            return res.status(500).json(boom.badRequest(err))
            
            const query = {
                $set: {
                    photo: routePhoto
                },
            }
            
            userscollection.updateOne(filter, query)
                .then(result => {
                    res.json({
                        result,
                        msg: "User photo updated succesfully"
                    })
                })
                .catch((err) => console.log(err))
        });
    });

    return app;
}   