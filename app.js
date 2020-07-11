'use strict'

var express = require('express');
var bodyparser = require('body-parser');
var app = express();
var companyRoutes = require('./routes/company.routes');
var productRoutes = require('./routes/product.routes');
var branchRoutes = require('./routes/branch.routes');

app.use(bodyparser.urlencoded({extended: false}));
app.use(bodyparser.json());

app.use((req, res, next) => {
	res.header('Access-Control-Allow-Origin', '*');
	res.header('Access-Control-Allow-Headers', 'Authorization, X-API-KEY, Origin, X-Requested-With, Content-Type, Accept, Access-Control-Allow-Request-Method');
	res.header('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, DELETE');
	res.header('Allow', 'GET, POST, OPTIONS, PUT, DELETE');
	next();
});

app.use('/company', companyRoutes);
app.use('/products', productRoutes);
app.use('/branch', branchRoutes);

module.exports = app;