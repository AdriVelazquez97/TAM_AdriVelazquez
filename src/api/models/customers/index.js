const customerSchemaPost = {
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
        surname: {
            type: 'string',
        },
        photo: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        additionalProperties: false,
    },
    additionalProperties: false,
    required: ['name', 'surname', 'email']
}

const customerSchemaPut = {
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
        surname: {
            type: 'string',
        },
        photo: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        additionalProperties: false,
    },
    additionalProperties: false,
}

module.exports = {
    customerSchemaPost,
    customerSchemaPut
}