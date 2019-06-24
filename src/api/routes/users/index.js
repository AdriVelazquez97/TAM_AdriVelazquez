const express = require('express');
const boom = require('boom')

const { ObjectId } = require('mongodb')

const { userSchemaPost, userSchemaPut } = require('../../models/users');
const { checkdData, checkIfExists } = require('../../helper')

module.exports = (mongoService) => {

    const app = express();
    const usercollection = mongoService.collection('users')


    app.get('/', (req, res, next) => {
        usercollection.find().toArray()
        .then(result => {
            res.json({
                result,
            })
        })
        .catch(err => res.json(err))
    });

    app.get('/:id', (req, res) => {
        const { id } = req.params;

        if(id.length != 24){
            return res.json(boom.badRequest('Invalid filter'))
        }

        const filter = {
            _id: ObjectId(id)
        }

        usercollection.findOne(filter)
            .then((result) => {
                res.json({
                    user: result 
                })
            })
            .catch((err) => console.log(err))
    })

    app.post('/', async (req, res, next) => {
        const { user } = req.body;
        
        const dataCheked = await checkdData(userSchemaPost, user)

        if(!dataCheked) { 
            return res.json(boom.badRequest('Invalid Data'))
        }

        const queryCheck = {
            email: user.email,
        }

        const valideIfExists = await checkIfExists(queryCheck, usercollection)

        if(valideIfExists){
            return res.json(boom.badRequest('Duplicate entrie'))
        }

        usercollection.insertOne(user)
        .then((result) => {  
            res.json({
                result,
                user,
                msg: "User inserted succesfully"
            })
        })
        .catch((err) => res.json(err))  
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

        const valideIfExists = await checkIfExists(filter, usercollection)

        if(!valideIfExists){
            return res.json(boom.badRequest('User not found'))
        }
        const query = {
            $set: user,
        }

        usercollection.updateOne(filter, query)
        .then(result => {
            res.json({
                result,
                msg: "User updated succesfully"
            })
        })
        .catch((err) => res.json(err))
    });

    app.delete('/:id', async (req, res, next) => {
        const { id } = req.params;

        if(id.length != 24){
            return res.json(boom.badRequest('Invalid filter'))
        }

        const filter = {
            _id: ObjectId(id)
        }

        const valideIfExists = await checkIfExists(filter, usercollection)
        
        if(!valideIfExists){
            return res.json(boom.badRequest('Entrie not found'))
        }

        usercollection.deleteOne(filter)
        .then(result => {
            res.json({
                result,
                msg: "User deleted succesfully"
            })
        })
        .catch((err) => res.json(err))
    })

    return app;
}   