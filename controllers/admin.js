const path = require("path");

const dirRoot = require('../util/path');

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        docTitle: 'Add Product',
        editing: false
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    req.user
        .createProduct({
            title, 
            price, 
            imageUrl, 
            description,
            userId: req.user.id
        })
        .then((result) => {
            console.log(result);
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err));
    
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    
    if (!editMode) {
        return res.redirect('/');
    };
    const prodId = req.params.productId;
    Product.findByPk(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                docTitle: 'Edit Product',
                editing: editMode,
                product
            })
        })
        .catch(err => console.log(err))
}

exports.postEditProduct = (req, res, next) => {
    const prodId = req.body.productId;
    const updatedTitle = req.body.title;
    const updatedImageUrl = req.body.imageUrl;
    const updatedDescription = req.body.description;
    const updatedPrice = req.body.price;
    Product.findByPk(prodId)
        .then(product => {
           product.title = updatedTitle;
           product.imageUrl = updatedImageUrl;
           product.description = updatedDescription;
           product.price = updatedPrice;
           return product.save();
        })
        .then(result => {
            console.log('updated product');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err))
}


exports.getProducts = (req, res, next) => {
    req.user.getProducts()
        .then(products => {
            res.render('admin/products', {prods: products, docTitle: 'Shop'})
        })
        .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByPk(prodId)
        .then(product => {
           return product.destroy();
        })
        .then(result => {
            console.log('product deleted');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err))
}