const Product = require('../models/product');
const Order = require('../models/order');

exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/product-list', {prods: products, docTitle: 'Products', isAuthenticated: req.session.isLoggedIn})
        })
        .catch(err => console.log(err))
}

exports.getProduct = (req, res, next) => {
    const prodId = req.params.productId;
    Product.findById(prodId)
    .then(product => {
        res.render('shop/product-details', {product, docTitle: 'product-details', isAuthenticated: req.session.isLoggedIn})
    })
    .catch(err => console.log(err))
}

exports.getIndex = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('shop/index', {prods: products, docTitle: 'Shop', isAuthenticated: req.session.isLoggedIn})
        })
        .catch(err => console.log(err))
}

exports.getCart = (req, res, next) => {
    console.log(req.session.user)
    req.session.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items;
            res.render('shop/cart', {
                docTitle: 'Cart',
                products,
                isAuthenticated: req.session.isLoggedIn
            })
        })
        .catch(err => console.log(err))
}

exports.postCart = (req, res, next) => {
    const prodId = req.body.productId;
    Product
        .findById(prodId)
        .then(product => {
            return req.session.user.addToCart(product);
        })
        .then(result => {
            console.log(result);
            res.redirect('/cart');
        })
}

exports.postCartDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    req.session.user
        .removeFromCart(prodId)
        .then(() => {
            res.redirect('/cart');
        })
        .catch(err => console.log(err))
}

exports.postOrders = (req, res, next) => {
    req.session.user
        .populate('cart.items.productId')
        .execPopulate()
        .then(user => {
            const products = user.cart.items.map(i => {
                return { quantity: i.quantity, product: { ...i.productId._doc } };
            });
            const order = new Order({
                user: {
                    name: req.session.user.name,
                    userId: req.session.user
                },
                products: products
            });
            return order.save();
        })
        .then(result => {
            return req.session.user.clearCart();
        })
        .then(() => {
            res.redirect('/orders');
        })
        .catch(err => console.log(err));
};

exports.getOrders = (req, res, next) => {
    Order.find({ 'user.userId': req.session.user._id })
        .then(orders => {
            res.render('shop/orders', {
                docTitle: 'Your Orders',
                orders: orders,
                isAuthenticated: req.session.isLoggedIn
            });
        })
        .catch(err => console.log(err));
};


