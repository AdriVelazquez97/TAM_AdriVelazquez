const express = require('express');

const userDef = require('./routes/users')
const { checkToken } = require('./middleware')

module.exports = (mongoService) => {

    const app = express();

    app.use(checkToken)
    app.use('/users', userDef(mongoService))

    return app;
}