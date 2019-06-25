const boom = require('boom');

module.exports = (req, res, next) => {
    const { user } = req

    if(!user.admin){
        return res.json(boom.unauthorized('Not have permissions'))
    }
    next();
}