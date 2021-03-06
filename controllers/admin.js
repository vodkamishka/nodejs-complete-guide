const Product = require('../models/product');

exports.getAddProduct = (req, res, next) => {
    res.render('admin/edit-product', {
        docTitle: 'Add Product',
        editing: false,
        isAuthenticated: req.session.isLoggedIn
    })
}

exports.postAddProduct = (req, res, next) => {
    const title = req.body.title;
    const imageUrl = req.body.imageUrl;
    const description = req.body.description;
    const price = req.body.price;
    const product = new Product({title,
        price,
        description,
        imageUrl,
        userId: req.session.user._id
    });
    product
        .save()
        .then(result => {
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
    Product.findById(prodId)
        .then(product => {
            if (!product) {
                return res.redirect('/');
            }
            res.render('admin/edit-product', {
                docTitle: 'Edit Product',
                editing: editMode,
                product,
                isAuthenticated: req.session.isLoggedIn
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

    Product.findById(prodId).then(product => {
        product.title = updatedTitle;
        product.price = updatedPrice;
        product.description = updatedDescription;
        product.imageUrl = updatedImageUrl;
        return product
            .save()
        })
        .then(result => {
            console.log('updated product');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err))
}


exports.getProducts = (req, res, next) => {
    Product.find()
        .then(products => {
            res.render('admin/products', {prods: products, docTitle: 'Shop', isAuthenticated: req.isLoggedIn})
        })
        .catch(err => console.log(err))
}

exports.postDeleteProduct = (req, res, next) => {
    const prodId = req.body.productId;
    Product.findByIdAndRemove(prodId)
        .then(() => {
            console.log('product deleted');
            res.redirect('/admin/products');
        })
        .catch(err => console.log(err))
}