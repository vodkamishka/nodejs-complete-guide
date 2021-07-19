const express = require('express');

const adminRoutes = require('./routes/admin');
const shopRoutes = require('./routes/shop');

const errorController = require('./controllers/error');

const app = express();

app.set('view engine', 'pug');
app.set('views', 'views');

app.use(express.urlencoded({extended: true}));

app.use(shopRoutes);
app.use('/admin', adminRoutes);
app.use(errorController.get404)

app.listen(3000);