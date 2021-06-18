const Sequelize = require('sequelize');
const configDB = require("../config/db.config");
const sequelize = new Sequelize(configDB.DB, configDB.USER, configDB.PASSWORD, {
    host: configDB.HOST,
    dialect: "mysql",
    pool: {
        max: 5,
        min: 0,
        acquire: 30000,
        idle: 10000
    }
});
const db = {}
db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
db.user = require("../models/User");
db.question = require("../models/Question");
//user.hasMany(likes);
//user.hasMany(comments);
//questions.hasMany(likes);
//questions.hasMany(comments);