'use strict'

var express = require('express');
var productController = require('../controller/products.controller');
var middlewereAuth = require('../middlewares/authenticated');


var api = express.Router();
api.post('/saveProduct', middlewereAuth.ensureAuth, productController.saveProduct);
api.put('/updateProduct/:id', middlewereAuth.ensureAuth, productController.updateProduct);


module.exports = api;