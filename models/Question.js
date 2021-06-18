const db = require("../database/db");
const user = require("./User");
const Sequelize = require("sequelize");


module.exports = db.sequelize.define(
    'question',
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true
        },
        user_id: {
            type: Sequelize.INTEGER
        },
        questionTitle: {
            type: Sequelize.STRING
        },
        questionText: {
            type: Sequelize.STRING
        }, 
        createdAt: {
            type: Sequelize.DATE
        }
    },
    {
        timestamps: false
    }
);
