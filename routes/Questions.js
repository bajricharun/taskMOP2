const express = require("express");
const questions = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const key = require("../config/jwtAuth.config");
const User = require("../models/User");
const Question = require("../models/Question");
const Like = require("../models/Likes");
const Comment = require("../models/Comments");
const { question, sequelize } = require("../database/db");
questions.use(cors());
process.env.SECRET_KEY = '1280f07cd273b0c2c6d8c072308e9e91af6407bfbfb518f7a598e3a6c7f581fb'


questions.post("/create", (req, res) => {

    var token = req.body.user_id;
    var decoded = jwt.verify(token, process.env.SECRET_KEY);
    var newVar = decoded['id'];
    var datetime = new Date();
    console.log(newVar);
    const questionData = {
        questionTitle: req.body.questionTitle,
        questionText: req.body.questionText,
        user_id:newVar,
        createdAt: datetime,
    }
    Question.create(questionData).then(question => {
        res.json({ status: question.questionTitle + "Posted"})
    })
    .catch(err => {
        res.send(err);
    })
});

questions.get("/showAll", (req, res) => {
   Question.findAll({
        limit: 20
    }).then(post => {
        if (post) {
            res.json(post);
            console.log(post);
        } else {
            res.send("no posts");
        }
    }).catch(err => {
        res.send(err);
    });
});

questions.post("/showMine", (req,res) => {
    var token = req.body.user_id;
    var decode = jwt.verify(token, process.env.SECRET_KEY);
    var userId = decode['id'];
    Question.findAll({
        where: {
            user_id:  userId,
        }
    }).then(post => {
        if (post) {
            res.json(post);
            console.log(post);
        } else {
            res.send("no posts");
        }
    }).catch(err => {
        res.send(err);
    });
})

// user to question
User.hasMany(Question, {foreignKey:'user_id'})
Question.belongsTo(User, {foreignKey:'user_id'})
// user to like
//User.hasMany(Like, {foreignKey:'user_id'})
//Like.belongsTo(User, {foreignKey:'user_id'})
// user to comment
//User.hasMany(Comment, {foreignKey: 'user_id'})
// post to like
//Question.hasMany(Like, {foreignKey:'question_id'})
//Like.belongsTo(Question, {foreignKey:'question_id'})
// post to comment


questions.get("/:id", (req,res) => {
    Question.findOne({
        where: {
            id: req.params.id
        },
        include: [User]
    }).then(post => {
        if (post)  {
            res.json(post);
            console.log(post);

        } else {
            res.send('no post found');
        }
    })
});

questions.get('/edit', (req,res) => {
    Question.findOne({
        where: {
            id: req.body.id
        }
    }).then(question=> {
        const questionTitle = '';
        const questionText = '';
        if (req.body.questionTitle == '') {
            questionTitle = question.questionTitle;
        } else {
            questionTitle = req.body.questionTitle;

        }
        if (req.body.questionText == '') {
            questionText = question.questionText;
        } else {
            questionText = req.body.questionText;
        }
        const postData = {
            questionTitle: questionTitle,
            questionText: questionText
        }
        question.update(postData)
    }).catch(err => {
        console.log(err)
    })
    
})

questions.post('addComment', (req, res) => {

    var decoded = jwt.verify(token, process.env.SECRET_KEY);
    var newVar = decoded.id;
    const commentData = {
        commentText: req.body.commentText,
        user_id: newVar,
        post_id: req.body.question_id
    }
    Comment.create(commentData)
    .then(comment => {
        res.json(comment + "commented")
    }).catch(err => {
        console.log(err)
    })
})

questions.post("addLike", (req,res)=> {
    const likeData = {
        question_id: req.body.postId,
    }
    console.log(likeData);
    Like.create(likeData).then(like => {
        res.json({status: "liked"})
    }).catch(err=> {
        console.log(err);
    })
})
module.exports = questions;