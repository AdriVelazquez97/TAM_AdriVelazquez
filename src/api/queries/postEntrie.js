const boom = require('boom')
const _ = require('lodash')
const { checkdData, checkIfExists } = require('../helper')
const bcrypt = require('bcrypt')

module.exports = (mongoCollection) => async (req, res, next) =>  {
    const entrie  = _.get(req, 'body', {});

    const dataCheked = await checkdData(req.schemaType, entrie)

    if(!dataCheked || _.isEmpty(entrie)) { 
        return res.json(boom.badRequest('Invalid Data'))
    }

    const queryCheck = {
        email: entrie.email,
    }

    const valideIfExists = await checkIfExists(queryCheck, mongoCollection)

    if(valideIfExists){
        return res.json(boom.badRequest('Duplicate entrie'))
    }

    if(req.collectionName == 'Users'){
        const passwordEncrypted = bcrypt.hashSync(entrie.password, 10)
        entrie.password = passwordEncrypted
    }

    mongoCollection.insertOne(entrie)
    .then((result) => {  
        res.json({
            entrie,
            msg: "Entrie inserted succesfully"
        })
    })
    .catch((err) => console.log(err))
}