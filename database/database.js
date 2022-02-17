const Sequelize = require('sequelize');
require('dotenv').config();

const connection = new Sequelize('botwhats', process.env.DATABASE_USER, process.env.DATABASE_PASSWORD,{
    host: 'localhost',
    dialect: 'mysql'
});

module.exports = connection;