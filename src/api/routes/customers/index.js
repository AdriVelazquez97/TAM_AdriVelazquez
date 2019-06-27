const express = require('express');
const boom = require('boom')
const { ObjectId } = require('mongodb')
const _ = require('lodash')
const { customerSchemaPost, customerSchemaPut } = require('../../models/customers');
const { checkdData, checkIfExists, createQuerySearch } = require('../../helper')

module.exports = (mongoService) => {

    const app = express();
    const customersCollection = mongoService.collection('customers')
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

        customersCollection.count()
        .then(count => {
            customersCollection.find({}).skip(skipParset).limit(limitParset).toArray()
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

        customersCollection.findOne(filter)
            .then((result) => {
                res.json({
                    result
                })
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

        customersCollection.count(querySearch)
        .then(count => {
            customersCollection.find(querySearch).skip(skipParset).limit(limitParset).toArray()
            .then(result => {
                res.json({
                    result,
                    count
                })
            })
            .catch(err => console.log(err))
        }) 
        .catch((err) => console.log(err))
    })

    app.post('/', async (req, res, next) => {
        const { customer } = req.body;
        
        const dataCheked = await checkdData(customerSchemaPost, customer)

        if(!dataCheked) { 
            return res.json(boom.badRequest('Invalid Data'))
        }

        const queryCheck = {
            email: customer.email,
        }

        const valideIfExists = await checkIfExists(queryCheck, customersCollection)

        if(valideIfExists){
            return res.json(boom.badRequest('Duplicate entrie'))
        }

        customer.createdBy = req.user.email

        customersCollection.insertOne(customer)
        .then((result) => {  
            res.json({
                result,
                customer,
                msg: "Customer inserted succesfully"
            })
        })
        .catch((err) => console.log(err))  

    });

    app.put('/:id', async (req, res) => {
        const { customer } = req.body;
        const { id } = req.params;

        if(id.length != 24){
            return res.json(boom.badRequest('Invalid filter'))
        }
        
        const dataCheked = await checkdData(customerSchemaPut, customer)

        if(!dataCheked) { 
            return res.json(boom.badRequest('Invalid Data'))
        }

        const filter = {
            _id: ObjectId(id)
        }

        const valideIfExists = await checkIfExists(filter, customersCollection)

        if(!valideIfExists){
            return res.json(boom.badRequest('Customer not found'))
        }

        customer.updatedBy = req.user.email

        const query = {
            $set: customer,
        }


        customersCollection.updateOne(filter, query)
        .then(result => {
            res.json({
                result,
                msg: "Customer updated succesfully"
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

        const valideIfExists = await checkIfExists(filter, customersCollection)
        
        if(!valideIfExists){
            return res.json(boom.badRequest('Customer not found'))
        }

        customersCollection.deleteOne(filter)
        .then(result => {
            res.json({
                result,
                msg: "Customer deleted succesfully"
            })
        })
        .catch((err) => console.log(err))
    })

    return app
}