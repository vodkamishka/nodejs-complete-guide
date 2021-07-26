const path = require("path");

const dirRoot = require('../util/path');

const Product = require('../models/product');
const Order = require('../models/order');

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
    let newQuantity = 1;
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
            if (product) {
                const oldQuantity = product.cartItem.quantity;
                newQuantity = oldQuantity + 1;
                return product;
            }
            return Product.findByPk(prodId)
        })
        .then(product => {
            return fetchedCart.addProduct(product, { through : { quantity: newQuantity }})
        })
        .then(() => res.redirect('/cart'))
        .catch(err => console.log(cart))
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.user
        .getCart()
        .then(cart => {
            return cart.getProducts({where: { id: prodId } })
        })
        .then(products => {
            const product = products[0];
            product.cartItem.destroy();
        })
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err))
}

exports.postOrders = (req, res, next) => {
    let fetchedCart;
    req.user
        .getCart()
        .then(cart => {
            fetchedCart = cart;
            return cart.getProducts();
        })
        .then(products => {
            return req.user
                .createOrder()
                .then(order => {
                    return order.addProducts(products.map(product => {
                        product.orderItem = { quantity: product.cartItem.quantity };
                        return product;
                    }));
                })
                .then()
                .catch(err => console.log(err))
            ;
        })
        .then(result => {
            return fetchedCart.setProducts(null)
        })
        .then(result => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err))
}

exports.getOrders = (req, res, next) => {
    req.user
        .getOrders({include: ['products']})
        .then(orders => {
            console.log(orders)
            res.render('shop/orders', {
                orders,
                docTitle: 'Orders',
            })
        })
        .catch(err => console.log(err))
}   


