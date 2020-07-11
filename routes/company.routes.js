'use strict'

var express = require('express');
var companyController = require('../controller/company.controller');
var middlewereAuth = require('../middlewares/authenticated');

var api = express.Router();


api.post('/saveCompany',companyController.saveCompany);
api.put('/updateCompany/:id', middlewereAuth.ensureAuth,companyController.updateCompany);
api.delete('/deleteCompany/:id', middlewereAuth.ensureAuth,companyController.deleteCompany);
api.post('/login', companyController.login);


api.get('/listCompaniesEmplo', middlewereAuth.ensureAuth,companyController.listCompaniesEmplo);
api.get('/listCompaniesProdu', middlewereAuth.ensureAuth,companyController.listCompaniesProdu);
api.put('/setProduct/:id', middlewereAuth.ensureAuth,companyController.setProduct);
api.put('/setBranch/:id', middlewereAuth.ensureAuth, companyController.setBranch);
api.put('/:idQ/removeProduct/:idL', middlewereAuth.ensureAuth,companyController.removeProduct);
// search
api.get('/searchProductCompany/:id', middlewereAuth.ensureAuth, companyController.searchProductCompany);
api.put('/searchCompany',middlewereAuth.ensureAuth, companyController.searchCompany);






api.put('/setEmployees/:id', middlewereAuth.ensureAuth,companyController.setEmployees);
api.get('/listEmployees/:id', middlewereAuth.ensureAuth,companyController.listEmployees);
api.put('/:idA/removeEmployee/:idB', middlewereAuth.ensureAuth,companyController.removeEmployee);


module.exports = api;