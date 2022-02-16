const Sequelize = require('sequelize');

const connection = new Sequelize('botwhats','root','Otaku',{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;