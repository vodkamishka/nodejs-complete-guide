const express = require('express');

const errorController = require('./controllers/error');
const db = require('./util/database');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

db.execute('SELECT * FROM products')
.then(result => {
    console.log(result);
})
.catch(err => {
    console.log(err);
});

app.use(express.urlencoded({extended: true}));

app.use(shopRoutes);
app.use('/admin', adminRoutes);
app.use(errorController.get404)

app.listen(3000);