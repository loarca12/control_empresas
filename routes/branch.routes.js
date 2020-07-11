'use strict'

var express = require('express');
var branchController = require('../controller/branch.controller');
var middlewereAuth = require('../middlewares/authenticated');

var api = express.Router();


api.post('/saveBranch', middlewereAuth.ensureAuth, branchController.saveBranch);
api.put('/updateBranch/:id', middlewereAuth.ensureAuth, branchController.updateBranch);
api.delete('/deleteBranch/:id', middlewereAuth.ensureAuth, branchController.deleteBranch);
api.get('/listBranchs', middlewereAuth.ensureAuth, branchController.listBranchs);
api.get('/searchProducta/:id', middlewereAuth.ensureAuth, branchController.searchProducta);
api.put('/addproduct',middlewereAuth.ensureAuth, branchController.addproduct);
api.get('/listProducts', middlewereAuth.ensureAuth, branchController.listProducts);
api.put('/setProduct/:id', middlewereAuth.ensureAuth, branchController.setProduct);
//pdf
api.get('/pdfProductsBranch/:id', middlewereAuth.ensureAuth, branchController.pdfProductsBranch);

api.put('/setEmployee/:id', middlewereAuth.ensureAuth, branchController.setEmployees);
api.get('/listEmployees', middlewereAuth.ensureAuth, branchController.listEmployees);





module.exports = api;