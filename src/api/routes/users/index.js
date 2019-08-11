const express = require('express');

const { basicSearch,
        searchById,
        searchWithFilters,
        postEntrie,
        putEntrie,
        deleteEntrie,
        putImage
} = require('../../queries');

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

    app.use(setPropertiesReq('Users', 'userSchema'))

    app.get('/', basicSearch(userscollection, defaultProperties, hideProperties));
    app.get('/:id', searchById(userscollection, hideProperties));

    app.post('/search', searchWithFilters(userscollection, defaultProperties))
    app.post('/', postEntrie(userscollection));

    app.put('/:id', putEntrie(userscollection));
    app.put('/upload/:id', putImage(userscollection));

    app.delete('/:id', deleteEntrie(userscollection))

    return app;
}   