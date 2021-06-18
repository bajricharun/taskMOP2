const express = require("express");
const likes = express.Router();
const cors = require("cors");
const Like = require("../models/Likes");
const { sequelize } = require("../database/db");
const jwt = require("jsonwebtoken");
likes.use(cors());
process.env.SECRET_KEY = '1280f07cd273b0c2c6d8c072308e9e91af6407bfbfb518f7a598e3a6c7f581fb'

likes.post('/addLike', (req, res) => {
    const dataLike = {
        question_id: req.body.question_id,
    }
    Like.create(dataLike).then(like => {
        res.json({status: 'liked'})
    }).catch(err=> {
        res.send(err)
    })
})
likes.get('/:id', (req, res) => {
    Like.findAll({where: {question_id: req.params.id}}).then(liked=> {res.json(liked)}).catch(err=>console.log(err));
})

module.exports = likes;