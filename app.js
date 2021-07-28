const express = require('express');

const errorController = require('./controllers/error');
const User = require('./models/user');
const mongoose = require('mongoose');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

app.use(express.urlencoded({extended: true}));

app.use((req, res, next) => {
    User.findById('6101926db0d5ad406866bdda')
        .then(user => {
            req.user = user;
            next();
        })
        .catch(err => console.log(err));
})

app.use('/admin', adminRoutes);
app.use(shopRoutes);

app.use(errorController.get404);

mongoose
    .connect('mongodb+srv://userAndrey:test123@cluster0.la1dq.mongodb.net/myFirstDatabase?retryWrites=true&w=majority', {useNewUrlParser: true, useUnifiedTopology: true})
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