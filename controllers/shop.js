const path = require("path");

const dirRoot = require('../util/path');

const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    res.sendFile(path.join(dirRoot, 'views', 'shop', 'product-list.html'));
    Product.fetchAll(products => {
        console.log(products);
    });
}

exports.getIndex = (req, res, next) => {
    
    Product.fetchAll(products => {
        res.sendFile(path.join(dirRoot, 'views', 'shop', 'index.html'));
        console.log(products);
    });
}

exports.getCart = (req, res, next) => {
    res.sendFile(path.join(dirRoot, 'views', 'shop', 'cart.html'));
    Product.fetchAll(products => {
        console.log(products);
    });
}

exports.getOrders = (req, res, next) => {
    res.sendFile(path.join(dirRoot, 'views', 'shop', 'orders.html'));
    Product.fetchAll(products => {
        console.log(products);
    });
}

exports.getCheckout = (req, res, next) => {
    res.sendFile(path.join(dirRoot, 'views', 'shop', 'checkout.html'));
    Product.fetchAll(products => {
        console.log(products);
    });
}

