'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'loarca12';

exports.createToken = (company) =>{
    var payload = {
        sub: company._id,
        name: company.name,
        email: company.email,
        role: company.role,
        iat: moment().unix(),
        exp: moment().add(30, "days").unix()
    };
        return jwt.encode(payload, key);
        
}

