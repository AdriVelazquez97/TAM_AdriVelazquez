const express = require('express');
const boom = require('boom')
const { ObjectId } = require('mongodb')
const _ = require('lodash')

const { checkdData, checkIfExists, createQuerySearch, setPropertiesReq } = require('../../helper')

const { basicSearch, searchById, searchWithFilters, postEntrie, putEntrie, deleteEntrie } = require('../../queries');

module.exports = (mongoService) => {

    const app = express();
    const customersCollection = mongoService.collection('customers')
    const defaultProperties = {
        skip: 0,
        limit: 10
    }

    app.use(setPropertiesReq('Customers', 'customerSchema'))

    app.get('/', basicSearch(customersCollection, defaultProperties, {}));
    app.get('/:id', searchById(customersCollection))
    app.post('/search', searchWithFilters(customersCollection, defaultProperties))

    app.post('/', postEntrie(customersCollection));

    app.put('/:id', putEntrie(customersCollection));

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

        const valideIfExists = await checkIfExists(filter, customersCollection);

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
        const routePhoto = `uploads/customers/${fillname}`;

        sampleFile.mv(routePhoto, (err) => {
            if (err)
            return res.status(500).json(boom.badRequest(err))
            
            const query = {
                $set: {
                    photo: routePhoto
                },
            }
            
            customersCollection.updateOne(filter, query)
                .then(result => {
                    res.json({
                        result,
                        msg: "Customer photo updated succesfully"
                    })
                })
                .catch((err) => console.log(err))
        });
    });

    app.delete('/:id', deleteEntrie(customersCollection))

    return app
}