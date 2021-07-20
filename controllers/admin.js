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
    const product = new Product(req.body);
    product.save();
    res.redirect('/');
}

exports.getEditProduct = (req, res, next) => {
    const editMode = req.query.edit;
    
    if (!editMode) {
        return res.redirect('/');
    };
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        if (!product) {
            return res.redirect('/');
        }
        res.render('admin/edit-product', {
            docTitle: 'Edit Product',
            editing: editMode,
            product
        })
    })
}


exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('admin/products', {prods: products, docTitle: 'Admin shop'})
    });
}