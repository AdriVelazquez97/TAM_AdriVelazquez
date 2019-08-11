const express = require('express');

const { setPropertiesReq } = require('../../helper')
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
    app.put('/upload/:id', putImage(customersCollection));

    app.delete('/:id', deleteEntrie(customersCollection))

    return app
}