const express = require('express');

const { checkToken, checkPermisions } = require('./middleware');

const userDef = require('./routes/users');
const customersDef = require('./routes/customers');

module.exports = (mongoService) => {

    const app = express();

    app.use(checkToken)
    
    app.use('/users', (req, res, next) => {
        checkPermisions(mongoService, req, res, next)
    }, userDef(mongoService))
    app.use('/customers', customersDef(mongoService))

    return app;
}