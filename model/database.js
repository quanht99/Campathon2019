const Sequelize = require('sequelize');
const fs = require("fs");
const path = require("path");
const basename = path.basename(__filename);
const config = require("config");
const db_info = config.get("database");
const db = {};

const sequelize = new Sequelize(
    db_info.name,
    db_info.user,
    db_info.password, {
        host: db_info.host,
        port: db_info.port,
        dialect: 'mysql',
        pool: {
            max: 5,
            min: 0,
            acquire: 1000000,
            idle: 200000,
        },
        define: {
            charset: 'utf8mb4',
            collate: 'utf8mb4_unicode_ci',
            timestamps: false,
            freezeTableName: true
        },
        logging: false
    }
);

fs
    .readdirSync(__dirname)
    .filter(file => {
        return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
    })
    .forEach(file => {
        var model = sequelize['import'](path.join(__dirname, file));
        db[model.name] = model;
    });


Object.keys(db).forEach(function (modelName) {
    if (db[modelName].associate) {
        db[modelName].associate(db);
    }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;


module.exports = db;