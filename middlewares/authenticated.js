'use strict'

var jwt = require('jwt-simple');
var moment = require('moment');
var key = 'loarca12';

exports.ensureAuth = (req, res, next)=>{
    if(!req.headers.authorization){
        return res.status(500).send({message: 'Petición de autorización.'});
    }else{
        var token = req.headers.authorization.replace(/["']+/g, '');
        try{
            var payload = jwt.decode(token, key);
            if(payload.exp <= moment().unix()){
                return  res.status(401).send({message: 'Token expirado.'});
            }
        }catch(ex){
            return res.status(404).send({message: 'Token no válido.'});
        }
        req.company = payload;
        req.products = payload;
        req.branch = payload;
        next();
    }
}
