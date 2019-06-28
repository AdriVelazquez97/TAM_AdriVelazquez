const userSchemaPost = {
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        photo: {
            type: 'string'
        },
        password: {
            type: 'string',
        },
        admin: {
            type: 'boolean',
            default: false,
        },
        additionalProperties: false,
    },
    additionalProperties: false,
    required: ['name', 'email', 'password']
};

const userSchemaPut = {
    type: 'object',
    properties: {
        name: {
            type: 'string'
        },
        email: {
            type: 'string'
        },
        photo: {
            type: 'string'
        },
        password: {
            type: 'string',
        },
        admin: {
            type: 'boolean',
        },
        additionalProperties: false,
    },
    additionalProperties: false,
};

module.exports = {
    userSchemaPost,
    userSchemaPut
}