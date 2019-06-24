const express = require('express');

const userDef = require('./routes/users')

module.exports = (mongoService) => {

    const app = express();

    app.use('/users', userDef(mongoService))

    return app;
}