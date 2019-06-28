const _ = require('lodash')
const Ajv = require('ajv');
const boom = require('boom')

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

function checkdData (schema, data) {
    const ajv = new Ajv({ useDefaults: true });
    const validate = ajv.compile(schema);
    const valid = validate(data);

    if (!valid){
        return false
    };

    return true;
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

module.exports = {
    checkIfExists,
    checkdData,
    createQuerySearch
}