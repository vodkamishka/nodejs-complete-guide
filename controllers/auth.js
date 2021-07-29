const User = require('../models/user');

exports.getLogin = (req, res, next) => {
    res.render('auth/login', {
        docTitle: 'Login',
        isAuthenticated: false
    });

};

exports.postLogin = (req, res, next) => {
    User.findById('6101926db0d5ad406866bdda')
        .then(user => {
            req.session.isLoggedIn = true
            req.session.user = user;
            req.session.save()
            res.redirect('/');
        })
        .catch(err => console.log(err));
};

exports.postLogout = (req, res, next) => {
    req.session.destroy(() => {
        res.redirect('/');
    })
};
