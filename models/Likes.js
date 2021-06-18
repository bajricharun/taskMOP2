const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'like', 
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        question_id: {
            type: Sequelize.INTEGER,
            references: "Questions",
            referencesKey: "id"
        }
    }
);