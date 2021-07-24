const path = require("path");

const dirRoot = require('../util/path');

const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/product-list', {prods: products, docTitle: 'Products'})
        })
        .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findByPk(prodId)
    .then(product => {
        res.render('shop/product-details', {product, docTitle: 'product-details'})
    })
    .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
    Product.findAll()
        .then(products => {
            res.render('shop/index', {prods: products, docTitle: 'Shop'})
        })
        .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
    req.user
        .getCart()
        .then(cart => {
            return cart
                .getProducts()
                .then(products => {
                    res.render('shop/cart', {
                        docTitle: 'Cart',
                        products
                    })
                })
                .catch(err => console.log(cart))
        })
        .catch(err => console.log(cart))
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts({ where: {id: prodId}})
        })
        .then(products => {
            let product;
            if (products.length > 0) {
                product = products[0];
            };
            let newQuantity = 1;
            if (product) {

            }
            return Product.findByPk(prodId)
                .then(product => {
                    return fetchedCart.addProduct(product, { through : { quantity: newQuantity }})
                })
                .catch(err => console.log(err))
        })
        .then(() => res.redirect('/cart'))
        .catch(err => console.log(cart))
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    console.log('prodId', prodId);
    Product.findById(prodId, product => {
        Cart.deleteProduct(prodId, product.price);
        res.redirect('/cart');
    })
}

exports.getOrders = (req, res, next) => {
    res.sendFile(path.join(dirRoot, 'views', 'shop', 'orders.html'));
    Product.fetchAll(products => {
       
    });
}

exports.getCheckout = (req, res, next) => {
    res.sendFile(path.join(dirRoot, 'views', 'shop', 'checkout.html'));
    Product.fetchAll(products => {
    });
}

