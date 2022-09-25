const expressJwt = require('express-jwt');

function authJwt(){
    return expressJwt({
        secret: 'secret',
        algorithms: ['HS256']
    });
}

module.exports = authJwt;