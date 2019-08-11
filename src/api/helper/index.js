const _ = require('lodash')
const Ajv = require('ajv');
const boom = require('boom')

const { userSchemaPost, userSchemaPut } = require('../models/users');
const { customerSchemaPost, customerSchemaPut } = require('../models/customers');

function checkIfExists (query, collection)  {
    return collection.findOne(query)
    .then((result) => {
        if (_.isEmpty(result)) {
            return false;
        }
        return true;
    })
    .catch((err) => console.log(err))
}

function checkdData (model, data) {
    const schema = takeProperModel(model)
    
    const ajv = new Ajv({ useDefaults: true });
    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (!valid){
        return false
    };

    return true;
}

function takeProperModel(modelName) {
    switch(modelName) {
        case 'userSchemaPOST':
            return userSchemaPost
        case 'userSchemaPUT':
            return userSchemaPut
        case 'customerSchemaPOST':
            return customerSchemaPost
        case 'customerSchemaPUT':
            return customerSchemaPut
    }
}

function createQuerySearch(searchParams) {
    if(_.isEmpty(searchParams)){
        return {}
    }

    const querySearch = searchParams.map(param => {
        
        const values = param.value.map(matchValue =>{
            return {
                [param.type]: matchValue
            }
        });
        
        return {
            $and: [{
                $or : values
            }]
        };
    })

    return {
        $and: querySearch
    }
}

setPropertiesReq = (collectionName, schemaType) => (req, res, next) => {
    req.collectionName = collectionName
    req.schemaType = `${schemaType}${req.method}`
    next()
}

module.exports = {
    checkIfExists,
    checkdData,
    createQuerySearch,
    setPropertiesReq
}