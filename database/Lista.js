const Sequelize = require("sequelize");
const connection = require("./database");

const Lista = connection.define('lista',{
    titulo:{
        type: Sequelize.STRING,
        allowNull: false
    },
    descricao:{
        type: Sequelize.TEXT,
        allowNull: false
    },
    contatos:{
        type: Sequelize.STRING,
        allowNull: false
    }
});

Lista.sync({force: false});

module.exports = Lista;