const express = require('express');
const boom = require('boom')
const _ = require('lodash')
const { ObjectId } = require('mongodb')
const bcrypt = require('bcrypt')

const { userSchemaPost, userSchemaPut } = require('../../models/users');
const { checkdData, checkIfExists, createQuerySearch } = require('../../helper')

module.exports = (mongoService) => {

    const app = express();
    const userscollection = mongoService.collection('users')
    const customersCollection = mongoService.collection('customers')

    const hideProperties = {
        password: 0
    }
    const defaultProperties = {
        skip: 0,
        limit: 10
    }

    app.get('/', (req, res, next) => {
        const skip = _.get(req.query, 'skip', defaultProperties.skip)
        const limit = _.get(req.query, 'limit', defaultProperties.limit)
        const skipParset = parseInt(skip);
        const limitParset = parseInt(limit);

        if(_.isNaN(skipParset) || _.isNaN(limitParset)){
            return res.json(boom.badData('Invalid values for skip and limit'))
        }

        userscollection.count()
        .then(count => {
            userscollection.find({}, hideProperties).skip(skipParset).limit(limitParset).toArray()
            .then(result => {
                res.json({
                    result,
                    count
                })
            })
            .catch(err => console.log(err))
        }) 
        .catch((err) => console.log(err))
    });

    app.get('/:id', (req, res) => {
        const { id } = req.params;

        if(id.length != 24){
            return res.json(boom.badRequest('Invalid filter'))
        }

        const filter = {
            _id: ObjectId(id)
        }

        userscollection.findOne(filter, hideProperties)
            .then((result) => {
                customersCollection.find({createdby: result.email}).toArray()
                    .then(values => {
                        res.json({
                            user: result,
                            customersCreated: values
                        })
                    })
                    .catch((err) => console.log(err))
            })
            .catch((err) => console.log(err))
    })

    app.post('/search', async (req, res, next) => {
        const searchParams = _.get(req.body, 'searchParams', {})
        const skip = _.get(req.query, 'skip', defaultProperties.skip)
        const limit = _.get(req.query, 'limit', defaultProperties.limit)
        const skipParset = parseInt(skip);
        const limitParset = parseInt(limit);

        if(_.isNaN(skipParset) || _.isNaN(limitParset)){
            return res.json(boom.badData('Invalid values for skip and limit'))
        }

        const querySearch = createQuerySearch(searchParams)

        userscollection.count(querySearch)
        .then(count => {
            userscollection.find(querySearch).skip(skipParset).limit(limitParset).toArray()
            .then(result => {
                res.json({
                    users: result,
                    count
                })
            })
            .catch(err => console.log(err))
        }) 
        .catch((err) => console.log(err))
    })

    app.post('/', async (req, res, next) => {
        const user  = _.get(req.body, 'user', {});

        const dataCheked = await checkdData(userSchemaPost, user)

        if(!dataCheked || _.isEmpty(user)) { 
            return res.json(boom.badRequest('Invalid Data'))
        }

        const queryCheck = {
            email: user.email,
        }

        const valideIfExists = await checkIfExists(queryCheck, userscollection)

        if(valideIfExists){
            return res.json(boom.badRequest('Duplicate entrie'))
        }

        const passwordEncrypted = bcrypt.hashSync(user.password, 10)
        user.password = passwordEncrypted

        userscollection.insertOne(user)
        .then((result) => {  
            res.json({
                result,
                user,
                msg: "User inserted succesfully"
            })
        })
        .catch((err) => console.log(err))

    });

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

    app.put('/:id', async (req, res) => {
        const user  = _.get(req.body, 'user', {});
        const { id } = req.params;

        if(id.length != 24){
            return res.json(boom.badRequest('Invalid filter'))
        }
        
        const dataCheked = await checkdData(userSchemaPut, user)

        if(!dataCheked || _.isEmpty(user)) { 
            return res.json(boom.badRequest('Invalid Data'))
        }

        const filter = {
            _id: ObjectId(id)
        }

        const valideIfExists = await checkIfExists(filter, userscollection)

        if(!valideIfExists){
            return res.json(boom.badRequest('User not found'))
        }
        const query = {
            $set: user,
        }

        userscollection.updateOne(filter, query)
        .then(result => {
            res.json({
                result,
                msg: "User updated succesfully"
            })
        })
        .catch((err) => console.log(err))
    });

    app.delete('/:id', async (req, res, next) => {
        const { id } = req.params;

        if(id.length != 24){
            return res.json(boom.badRequest('Invalid filter'))
        }

        const filter = {
            _id: ObjectId(id)
        }

        const valideIfExists = await checkIfExists(filter, userscollection)
        
        if(!valideIfExists){
            return res.json(boom.badRequest('Entrie not found'))
        }

        userscollection.deleteOne(filter)
        .then(result => {
            res.json({
                result,
                msg: "User deleted succesfully"
            })
        })
        .catch((err) => console.log(err))
    })

    return app;
}   