'use strict'

var Branch = require('../model/branch.model');
var Products = require('..//model/products.model');
var PDF = require('pdfkit');
var fs = require('fs');

function saveBranch(req, res){
    var branch = new Branch();
    var params = req.body;

    if(params.name &&
        params.address &&
        params. phone &&
        params.email){

            Branch.findOne({phone: params.phone},{email: params.email},(err, branchFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general.'});
                }else if(branchFind){
                    res.send({message: 'Teléfono o correo ya en uso.'});
                }else{
                    branch.name = params.name;
                    branch.address = params.address;
                    branch.phone = params.phone;
                    branch.email = params.email;

                    branch.save((err, branchSaved)=>{
                        if(err){
                            res.status(500).send({message: 'Error general.'});
                        }else if(branchSaved){
                            res.send({branch: branchSaved});
                        }else{
                            res.status(418).send({message: 'No es posible guardar la sucursal'});
                        }
                    });
                }
            });
    }else{
        res.send({message: 'Necesita llenar los campos.'});
    }
}

function updateBranch(req, res){
    var branchId = req.params.id;
    var update = req.body;

    Branch.findByIdAndUpdate(branchId, update, {new: true}, (err, branchUpdated)=>{
        if(err){
            res.status(500).send({message: 'Error general.'});
        }else if(branchUpdated){
            res.send({updated: branchUpdated});
        }else{
            res.status(418).send({message: 'No se ha podido actualizar.'});
        }
    });
}


function deleteBranch(req, res){
    var branchId = req.params.id

    Branch.findByIdAndRemove(branchId, (err, branchDeleted)=>{
        if(err){
            res.status(500).send({message: 'Error general.'});
        }else if(branchDeleted){
            res.send({deleted: branchDeleted});
        }else{
            res.status(418).send({message: 'No se pudo eliminar.'});
        }
    });   
}

function setProduct(req, res){
    let branchId = req.params.id;
    let params = req.body;

        if(params.idProduct){
            Branch.findById(branchId, (err, branchFind)=>{
                 if(err){
                     res.status(500).send({message: 'Error general.'});
                 }else if(branchFind){
                     Branch.findByIdAndUpdate(branchId, {$push: {products: params.idProduct}},{new: true}, (err, branchUpdated)=>{
                         if(err){
                             res.status(500).send({message: 'Error general.', err});
                         }else if(branchUpdated){
                             res.send({branch: branchUpdated});
                         }else{
                             res.status(418).send({message: 'Error al actualizar.'});
                         }
                     });
                 }else{
                     res.status(404).send({message: 'Producto no encontrado.'})
                 }
            });
        }else{
             res.send({message: 'Llena el campo.'});
        }
 }

 function listProducts(req, res){
    Branch.find({}, (err, products)=>{
        Products.populate(products, {path: "products"},function(err, products){
            res.status(200).send({list: products});
        }); 
    });
}

function setEmployees(req, res){
    let branchId = req.params.id;
    let params = req.body;
 
        if(params.idEmployee){
            Branch.findById(branchId, (err, companyFind)=>{
                 if(err){
                     res.status(500).send({message: 'Error general.'});
                 }else if(companyFind){
                     Branch.findByIdAndUpdate(branchId, {$push: {employees: params.idEmployee}},{new: true}, (err, branchUpdated)=>{
                         if(err){
                             res.status(500).send({message: 'Error general.'});
                         }else if(branchUpdated){
                             res.send({branch: branchUpdated});
                         }else{
                             res.status(418).send({message: 'Error al actualizar.'});
                         }
                     });
                 }else{
                     res.status(404).send({message: 'Sucursal no encontrada.'})
                 }
            });
        }else{
             res.send({message: 'Faltan datos.'});
        }
    }

function listEmployees(req, res){
    Branch.find({}, (err, employees)=>{
        Employee.populate(employees, {path: "employees"},function(err, employees){
            res.status(200).send({list: emlpoyees});
        }); 
    });
}

function listBranchs(req, res){
    Branch.find({}).exec((err, branchs)=>{
        if(err){
            res.status(500).send({message: 'Error general.'});
        }else if(branchs){
            res.send({branchs: branchs});
        }else{
            res.send({message: 'No hay registros'});
        }
    });
}

function searchProducta(req,res){
    let id = req.params.id;
    let name = req.body.name;
    
        Products.findOne({nameProduct:{$regex:name,$options:'i'}},(err,productFound)=>{
            if(err){
                res.status(500).send({message:'Error general'});
                console.log(err);
            }else if(productFound){
                Branch.findById(id,(err,branch)=>{
                    if(err){
                        res.status(500).send({message:'Error general'});
                        console.log(err);
                    }else if(branch){
                        branch.products.forEach((product,i)=>{
                            if(productFound._id.equals(product)){
                                res.send(productFound);
                            }else{
                                res.status(404).send({message:'Producto no encontrado'});
                            }
                        });
                    }else{
                        res.send({message:'Sucursal no encontrada'});
                    }
                });
            }else{
                res.status(404).send({message:'Producto no encontrado'});
            }
        });
}

//pdf
function pdfProductsBranch(req, res){
    var branchId = req.params.id;
    var doc = new PDF();

    doc.pipe(fs.createWriteStream(__dirname+'Sucursal.pdf'));
    Branch.findById(branchId, (err, branchFind)=>{
        if(err){
            res.status(500).send({message: 'Error general.'});
        }else if(branchId){
            doc.text('Productos en sucursal');
            doc.text(branchFind);
            doc.end();
            res.send({message: 'PDF generado', branchFind});
        }else{
            res.status(404).send({message: 'No hay registros.'});
        }
    });
}

function addproduct(req, res) {
    var params = req.body;
    
    Products.findById(params.product, (err, productfind)=>{
        if (err){
            res.status(500).send({message: 'Error general.'});

        }else if(!productfind){
            res.status(404).send({message: 'No existe el producto'});
        }else if(productfind.quantity< params.stock){
            res.status(400).send({message: 'productos insuficientes'});

        }else{
            Products.findByIdAndUpdate(params.product, {$inc:{quantity:(params.stock * -1)}},(err, productupdated)=>{
                if(err){
                    res.status(500).send({message: 'Error general.'}); 
                }else if(!productupdated){
                    res.status(400).send({message: 'error actualizar'}); 
                }else{
                    Branch.findByIdAndUpdate(params._id, {'products.$.productId':params.product,$inc:{'products.$.stock':params.stock}},{new: true},(err, branchUpdated)=>{
                        if (err){
                            res.status(500).send({message: 'Error general.'});
                
                        }else if(!branchUpdated){
                            res.status(404).send({message: 'sucursal no actualizada'});  
                            }else{
                                res.status(200).send({message: branchUpdated});
                            }
        
                        });
                }
            })
            
        }

    })
    
}

module.exports = {
    saveBranch,
    setEmployees,
    setProduct,
    updateBranch,
    deleteBranch,
    listProducts,
    listEmployees,
    listBranchs,
    searchProducta,
    pdfProductsBranch,
    addproduct
}