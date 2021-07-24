const Sequelize = require('sequelize');

const sequelize = new Sequelize('node-complete', 'root', 'andru2202', {
    dialect: 'mysql',
    host: 'localhost'
});

module.exports = sequelize;