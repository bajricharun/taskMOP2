const Sequelize = require("sequelize");
const db = require("../database/db");

module.exports = db.sequelize.define(
    'comment', 
    {
        id: {
            type: Sequelize.INTEGER,
            primaryKey: true,
            autoIncrement: true,
        },
        user_id: {
            type: Sequelize.INTEGER,
            references: "users",
            referencesKey: 'id'
        },
        question_id: {
            type: Sequelize.INTEGER,
            references: "Questions",
            referencesKey: "id"
        },
        commentText: {
            type: Sequelize.TEXT,
        }
    }
);