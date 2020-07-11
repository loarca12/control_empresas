'use strict'

var Company = require('../model/company.model');
var bcrypt = require('bcrypt-nodejs');
var jwt = require('../services/jwt');
var Products = require('../model/products.model');



function saveCompany(req, res){
    var company = new Company();
    var params = req.body;

    if(params.name &&
        params.address &&
        params.email &&
        params.phone &&
        params.activity &&
        params.password){

            Company.findOne({$or:[{email: params.email},{name: params.name}]}, (err, companyFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general.3543', err});
                }else if(companyFind){
                    res.send({message: 'Nombre de y/o correo de empresa ya utilizado.'});
                }else{
                    company.name = params.name;
                    company.address = params.address;
                    company.email = params.email;
                    company.phone = params.phone;
                    company.activity = params.activity;
                    company.password = params.password;

                    bcrypt.hash(params.password, null, null, (err,hashPassword)=>{
                        if(err){
                            res.status(500).send({message: 'Error de encriptación'});
                        }else{
                            company.password = hashPassword;
                            company.save((err, companySaved)=>{
                                if(err){
                                    res.status(500).send({message: 'Error general.', err});
                                }else if(companySaved){
                                    res.send({company: companySaved});
                                }else{
                                    res.send({message: 'Error al guardar empresa.'});
                                }
                            });
                        }
                    });
                }
            });
    }else{
        res.send({message: 'Por favor ingrese todos los datos.'});
    }
}


function login(req, res){
    var params = req.body;

    if(params.name || params.email){
        if(params.password){
            Company.findOne({$or:[{name: params.name},
            {email: params.email}]}, (err, companyFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general.'});
                }else if(companyFind){
                    bcrypt.compare(params.password, companyFind.password, (err, checkPassword)=>{
                        if(err){
                            res.status(500).send({message: 'Error al compara contraseñas.'});
                        }else if(checkPassword){
                            if(params.gettoken){
                                res.send({token:  jwt.createToken(companyFind)});
                            }else{
                            res.send({user: companyFind});
                            }
                        }else{
                            res.status(500).send({message: 'Contreña incorrecta'});
                        }
                    });
                }else{
                    res.send({message: 'Empresa no encontrada'});
                }
        });
        }else{
            res.send({message: 'Por favor ingresa la contraseña.'});
        }
    }else{
        res.send({message: 'Ingresa el nombre o correo de empresa.'});
    }
}


function updateCompany(req, res) {
    var companyId = req.params.id;
    var update = req.body;

    Company.findByIdAndUpdate(companyId, update,{new: true}, (err, companyUpdated)=>{
        if (err) {
            res.status(500).send({message: 'Error general'});
        } else if (companyUpdated) {
            res.send({company: companyUpdated});
        } else {
            res.status(418).send({message: 'No se ha podido actualizar la empresa'});
        }
    });
}


function deleteCompany(req, res){
    var companyId = req.params.id;

    Company.findByIdAndRemove(companyId, (err, companyDeleted)=>{
        if(err){
            res.status(500).send({message: 'Error general.'});
        }else if(companyDeleted){
                res.send({message: 'Empresa eliminada:', companyDeleted});
        }else{
            res.status(404).send({message: 'Error al eliminar la empresa.'});
        }
    });
} 


function setEmployees(req, res){
    let companyId = req.params.id;
    let params = req.body;
 
        if(params.idEmployee){
            Company.findById(companyId, (err, companyFind)=>{
                 if(err){
                     res.status(500).send({message: 'Error general.'});
                 }else if(companyFind){
                     Company.findByIdAndUpdate(companyId, {$push: {employee: params.idEmployee}},{new: true}, (err, companyUpdated)=>{
                         if(err){
                             res.status(500).send({message: 'Error general.'});
                         }else if(companyUpdated){
                             res.send({company: companyUpdated});
                         }else{
                             res.status(418).send({message: 'Error al actualizar.'});
                         }
                     });
                 }else{
                     res.status(404).send({message: 'Empresa no encontrada.'})
                 }
            });
        }else{
             res.send({message: 'Faltan datos.'});
        }
    }



function listEmployees(req, res){
    const companyId = req.params.id;

    Company.findById(companyId, (err, company)=>{
        if(err){
            res.status(500).send({message: 'Error en servidor'});
        }else if(company){
                res.send({Company: company.name, Employees: company.employee.length});
            }else{  
                res.status(200).send({message: 'No hay registros'});
            }
        
    });
}



function removeEmployee(req, res){
    let companyId = req.params.idA;
    let employeeId = req.params.idB;

    Company.findByIdAndUpdate(companyId, 
    {$pull:{employee:employeeId}}, {new: true},
    (err, employeeRemoved)=>{
        if(err){
            res.status(500).send({message: 'Error general', err});
        }else if(employeeRemoved){
            res.send({employee: employeeRemoved});
        }else{
            res.status(418).send({message: 'Empleado no eliminado'});
        }
    });

}



function setProduct(req, res){
    let companyId = req.params.id;
    let params = req.body;
 
    if(params.idProduct){
            Company.findOne({idProduct: params.idProduct}, (err, companyFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general.'});
                }else if(companyFind){
                    res.send({message: 'Producto ya existente'});
                }else{
        if(params.idProduct){
            Company.findById(companyId, (err, companyFind)=>{
                 if(err){
                     res.status(500).send({message: 'Error general.'});
                 }else if(companyFind){
                     Company.findByIdAndUpdate(companyId, {$push: {products: params.idProduct}},{new: true}, (err, companyUpdated)=>{
                         if(err){
                             res.status(500).send({message: 'Error general.'});
                         }else if(companyUpdated){
                             res.send({company: companyUpdated});
                         }else{
                             res.status(418).send({message: 'Error al actualizar.'});
                         }
                     });
                 }else{
                     res.status(404).send({message: 'Empresa no encontrada.'})
                 }
            });
        }else{
             res.send({message: 'Faltan datos.'});
        }
    }
});
}
else{
    res.send({message: 'Faltan datos.'});
}

    }
    
function removeProduct(req, res){
    let companyId = req.params.idQ;
    let productId = req.params.idL;
    
        Company.findByIdAndUpdate(companyId, 
        {$pull:{product:productId}}, {new: true},
        (err, productRemoved)=>{
            if(err){
                res.status(500).send({message: 'Error general', err});
            }else if(productRemoved){
                res.send({productRemove: productRemoved});
            }else{
                res.status(418).send({message: 'Producto no eliminado', err});
            }
        });
    
    }
      
function setBranch(req, res){
        let companyId = req.params.id;
        let params = req.body;
    
        if(params.idBranch){
            Company.findById(companyId, (err, companyFind)=>{
                if(err){
                    res.status(500).send({message: 'Error general.'});
                }else if(companyFind){
                    Company.findByIdAndUpdate(companyId, {$push:{branchs: params.idBranch}}, {new: true},(err, companyUpdated)=>{
                        if(err){
                            res.status(500).send({message: 'Error general.'});
                        }else if(companyUpdated){
                            res.send({company: companyUpdated});
                        }else{
                            res.status(418).send({message: 'No se ha podido actualizar.'});
                        }
                    });
                }else{
                    res.status(404).send({message: 'Empresa no encontrada.'});
                }
            });
        }else{
            res.send({message: 'Llena el campo.'});
        }
    }

function listCompaniesEmplo(req, res){
    Company.find({}, (err, employees)=>{
        Employees.populate(employees, {path: "employee"},function(err, employees){
            res.status(200).send({list: employees});
        });
    });
}
        
function listCompaniesProdu(req, res){
    Company.find({}, (err, products)=>{
        Products.populate(products, {path: "products"},function(err, products){
            res.status(200).send({list: products});
        });
    });
}


function searchProductCompany(req,res){
    let id = req.params.id;
    let name = req.body.name;
    
        Products.findOne({nameProduct:{$regex:name,$options:'i'}},(err,productFound)=>{
            if(err){
                res.status(500).send({message:'Error general.'});
                console.log(err);
            }else if(productFound){
                Company.findById(id,(err,company)=>{
                    if(err){
                        res.status(500).send({message:'Error general'});
                        console.log(err);
                    }else if(company){
                        company.products.forEach((product,i)=>{
                            if(productFound._id.equals(product)){
                                res.send(productFound);
                            }else{
                                res.status(404).send({message:'Producto no encontrado'});
                            }
                        });
                    }else{
                        res.send({message:'Compañía no encontrada'});
                    }
                });
            }else{
                res.status(404).send({message:'Producto no encontrado.'});
            }
        });
}

function searchCompany(req, res) {
    var params = req.body;

    Products.find({ quantity: params.quantity },{company: params.company}, (err, find) => {
        if(err) res.status(500).send({ message: 'Error General' })
        else if(!find) res.status(404).send({ message: 'No Encontrado' });
        else {
            res.status(200).send({ message: find });
        }
    });    
} 


module.exports = {
    saveCompany,
    updateCompany,
    deleteCompany,
    setEmployees,
    listEmployees,
    removeEmployee,
    listCompaniesEmplo,
    login,
    setProduct,
    setBranch,
    listCompaniesProdu,
    searchProductCompany,
    removeProduct,
    searchCompany
}