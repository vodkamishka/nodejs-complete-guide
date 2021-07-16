const path = require("path");

const dirRoot = require('../util/path');

const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.sendFile(path.join(dirRoot, 'views', 'admin', 'add-product.html'));
}

exports.postAddProduct = (req, res, next) => {
    const product = new Product(req.body);
    product.save();
    res.redirect('/');
}

exports.getProducts = (req, res, next) => {
    res.sendFile(path.join(dirRoot, 'views', 'admin', 'products.html'));
    Product.fetchAll(products => {
        console.log(products);
    });
}