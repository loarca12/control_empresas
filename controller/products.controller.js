'use strict'

var Product = require('../model/products.model');

function saveProduct(req, res){
    var product = new Product();
    var params = req.body;

    if(params.nameProduct &&
        params.quantity){
            
            product.nameProduct = params.nameProduct;
            product.quantity = params.quantity;

            product.save((err, productSaved)=>{
                if(err){
                    res.status(500).send({message: 'Error general.'});
                }else if(productSaved){
                    res.send({productSaved: productSaved});
                }else{
                    res.status(418).send({message: 'Error al guardar.'});
                }
            });

    }else{
        res.send({message: 'Debe llenar todos los campos'});
    }
}

function updateProduct(req, res){
    var productId = req.params.id;
    var update = req.body;

    Product.findByIdAndUpdate(productId, update, {new: true},(err, productUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error general.'});
        }else if(productUpdated){
            res.send({productUpdated: productUpdated});
        }else{
            res.status(418).send({message: 'No se pudo actualizar.'});
        }
    });
}


function deteleProduct(req, res){
    var productId = req.body.id;

    Product.findByIdAndRemove(productId, (err, productDeleted)=>{
        if(err){
            res.status(500).send({message: 'Error general'});
        }else if(productDeleted){
            res.send({productDeleted: productDeleted});
        }else{
            res.status(418).send({message: 'No se pudo eliminar.'});
        }
    });
}

module.exports = {
    saveProduct,
    updateProduct,
    deteleProduct
}