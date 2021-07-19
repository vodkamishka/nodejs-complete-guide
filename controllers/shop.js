const path = require("path");

const dirRoot = require('../util/path');

const Product = require('../models/product');

exports.getProducts = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/product-list', {prods: products, docTitle: 'Products'})
        console.log(products);
    });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId, product => {
        res.render('shop/product-details', {product, docTitle: 'product-details'})
    })
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll(products => {
        res.render('shop/index', {prods: products, docTitle: 'Shop'})
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

