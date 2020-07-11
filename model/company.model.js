'use strict'

var mongoose = require('mongoose');
var Schema = mongoose.Schema;


var registroSchema = Schema({
    name: String,
    address: String,
    phone: Number,
    email: String,
    activity: String,
    password: String,
    employee: [{type: Schema.Types.ObjectId, ref: 'employee'}],
    products: [{type: Schema.Types.ObjectId, ref: 'product'}],
    branchs: [{type: Schema.Types.ObjectId, ref: 'branch'}]
});

module.exports = mongoose.model('companie', registroSchema);