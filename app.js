const express = require('express');

const errorController = require('./controllers/error');
const User = require('./models/user');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoDBStore = require('connect-mongodb-session')(session);

const MONGODB_URI ='mongodb+srv://userAndrey:test123@cluster0.la1dq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority';

const app = express();

const store = new MongoDBStore({
    uri: MONGODB_URI,
    collection: 'sessions'
}, err => console.log(err));

app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');
const authRoutes = require('./routes/auth');

app.use(express.urlencoded({extended: true}));
app.use(
    session({
        secret: 'my secret',
        resave: false,
        saveUninitialized: false,
        store
    })
);

app.use((req,res, next) => {
    if (!req.session.user) {
        return next();
    }
    User.findById(req.session.user._id)
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
});

app.use('/admin', adminRoutes);
app.use(shopRoutes);
app.use(authRoutes);

app.use(errorController.get404);

mongoose
    .connect(MONGODB_URI, {useNewUrlParser: true, useUnifiedTopology: true})
    .then(() => {
        User.findOne().then(user => {
            if (!user) {
                const user = new User({
                    name: "Andru",
                    email: "andrtomsk@narod.ru",
                    cart: {
                        items: []
                    }
                })
                user.save();
            }
        })

        app.listen(3000);
    })
    .catch(err => console.log(err))