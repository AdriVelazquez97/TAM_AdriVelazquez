const express = require('express');
const boom = require('boom')
const _ = require('lodash')
const { ObjectId } = require('mongodb')
const bcrypt = require('bcrypt')

const { userSchemaPost, userSchemaPut } = require('../../models/users');
const { checkdData, checkIfExists } = require('../../helper')

module.exports = (mongoService) => {

    const app = express();
    const userscollection = mongoService.collection('users')
    const hideProperties = {
        password: 0
    }

    app.get('/', (req, res, next) => {
        userscollection.find({}, hideProperties).toArray()
        .then(result => {
            res.json({
                result,
                count: Object.keys(result).length
            })
        })
        .catch(err => console.log(err))
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
                res.json({
                    result
                })
            })
            .catch((err) => console.log(err))
    })

    // Create search with params

    app.post('/', async (req, res, next) => {
        const { user } = req.body;
        
        const dataCheked = await checkdData(userSchemaPost, user)

        if(!dataCheked) { 
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

    app.put('/:id', async (req, res) => {
        const { user } = req.body;
        const { id } = req.params;

        if(id.length != 24){
            return res.json(boom.badRequest('Invalid filter'))
        }
        
        const dataCheked = await checkdData(userSchemaPut, user)

        if(!dataCheked) { 
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