const path = require("path");

const dirRoot = require('../util/path');

const Product = require('../models/product');
const Cart = require('../models/cart');

exports.getProducts = (req, res, next) => {
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            res.render('shop/product-list', {prods: rows, docTitle: 'Products'})
        }).catch(err => {
            console.log(err);
        });
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(([product]) => {
        res.render('shop/product-details', {product: product[0], docTitle: 'product-details'})
    })
    .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
    Product.fetchAll()
        .then(([rows, fieldData]) => {
            res.render('shop/index', {prods: rows, docTitle: 'Shop'})
        }).catch(err => {
            console.log(err);
        });
}

exports.getCart = (req, res, next) => {
    Cart.getCart(cart => {
        Product.fetchAll(products => {
            const cartProducts = [];
            for (product of products) {
                if (typeof cart.products === 'object') {
                    const cartProductData = cart.products.find(prod => prod.id === product.id);
                    if (cartProductData) {
                        cartProducts.push({productData: product, qty: cartProductData.qty});
                    }
                }
            }
            res.render('shop/cart', {
                docTitle: 'Cart',
                products: cartProducts
            })
        })
    })
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findById(prodId, product => {
        Cart.addProduct(prodId, product.price)
    })
    res.redirect('/cart');
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

