'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var productSchema = Schema({
    nameProduct: String,
    quantity: Number,
    trademark: String,
    price: String
})

module.exports = mongoose.model('product', productSchema);