const express = require("express");
const comments = express.Router();
const cors = require("cors");
const Comment = require("../models/Comments");
const { sequelize } = require("../database/db");
const jwt = require("jsonwebtoken");
const Comments = require("../models/Comments");
const User = require("../models/User");
comments.use(cors());
process.env.SECRET_KEY = '1280f07cd273b0c2c6d8c072308e9e91af6407bfbfb518f7a598e3a6c7f581fb'

comments.post('/addComment', (req, res) => {
    decoded = jwt.verify(req.body.user_id, process.env.SECRET_KEY)
    const dataComment = {
        user_id: decoded.id,
        question_id: req.body.question_id,
        commentText: req.body.commentText
    }
    Comment.create(dataComment).then(comment => {
        res.json({status: 'commented'})
    }).catch(err=> {
        res.send(err)
    })
})

User.hasMany(Comment, {foreignKey:'user_id'})
Comment.belongsTo(User, {foreignKey: 'user_id'})
comments.get("/:id", (req,res) => {
    Comments.findAll({
        where: {
            question_id: req.params.id
        },
        include: [User]
        
    }).then(comment => {
        res.json(comment)
    }).catch(err=> {res.send(err)})
})

module.exports = comments;