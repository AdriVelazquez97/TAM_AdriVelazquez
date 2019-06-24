const express = require('express');
const _ = require('lodash');
const boom = require('boom')
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt')

module.exports = (mongoService) => {
    const app = express()
    const usercollection = mongoService.collection('users')

    app.post('/', (req, res, next) => {
        const { email, password } = req.body

        const query = {
            $and: [
                {email},
                {password}
            ]
        }
        const hideProperties = {
            password: 0
        }

        usercollection.findOne(query, hideProperties )
        .then(result => {
            if(_.isEmpty(result)){
                res.json(boom.badRequest('User or password incorrect'))
            }

            const token = jwt.sign({
                user: result
            }, process.env.SEED, {expiresIn: 60 * 60 * 24 * 7})

            res.json({
                msg: 'Login succesfully',
                token
            })
        })
        .catch(err => console.log(err))
    })

    return app
}