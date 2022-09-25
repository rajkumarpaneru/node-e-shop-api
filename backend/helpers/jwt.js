const expressJwt = require('express-jwt');

function authJwt(){
    return expressJwt({
        secret: 'secret',
        algorithms: ['HS256']
    }).unless({
        path: [
             {url: /\/api\/v1\/products(.*)/, methods: ['GET','OPTIONS']},
             {url: /\/api\/v1\/categories(.*)/, methods: ['GET','OPTIONS']},
             '/api/v1/users/register',
             '/api/v1/users/login',
        ]
    })
}

module.exports = authJwt;