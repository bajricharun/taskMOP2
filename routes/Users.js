const express = require("express");
const users = express.Router();
const cors = require("cors");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const key = require("../config/jwtAuth.config");
const User = require("../models/User");
const session = require('express-session');
const Question = require("../models/Question");
users.use(cors());

process.env.SECRET_KEY = '1280f07cd273b0c2c6d8c072308e9e91af6407bfbfb518f7a598e3a6c7f581fb'


users.post('/register', (req, res) => {
    const today = new Date()
    const userData = {
      first_name: req.body.first_name,
      last_name: req.body.last_name,
      email: req.body.email,
      password: req.body.password,
      created: today
    }
  
    User.findOne({
      where: {
        email: req.body.email
      }
    })
      //TODO bcrypt
      .then(user => {
        if (!user) {
          bcrypt.hash(req.body.password, 10, (err, hash) => {
            userData.password = hash
            User.create(userData)
              .then(user => {
                res.json({ status: user.email + 'Registered!' })
              })
              .catch(err => {
                res.send('error: ' + err)
              })
          })
        } else {
          res.json({ error: 'User already exists' })
        }
      })
      .catch(err => {
        res.send('error: ' + err)
      })
  })
  
  users.post('/login', (req, res) => {
    User.findOne({
      where: {
        email: req.body.email
      }
    })
      .then(user => {
        if (user) {
          if (bcrypt.compareSync(req.body.password, user.password)) {
            let token = jwt.sign(user.dataValues, process.env.SECRET_KEY, {
              expiresIn: 1440
            })
            res.send(token)
          }
        } else {
          res.status(400).json({ error: 'User does not exist' })
        }
      })
      .catch(err => {
        res.status(400).json({ error: err })
      })
  })
users.post("/findID", (req, res) => {
    var decoded = jwt.verify(req.headers['authorization'], process.env.SECRET_KEY);
    res.send(decoded.id);
})

users.post('/changeInfo', (req, res) => {
    User.findOne({
        where: {
            id: req.body.user_id
        }
    }).then(user => {
        if(user) {
            if (bcrypt.compareSync(req.body.oldPWD, user.password)) {
                bcrypt.hash(req.body.newPWD, 10, (err, hash) => {
                    user.update({
                        password: hash,
                    })
                    res.send('changed pwd')
                })
            } else {
                res.status(500).json({error:err})
            } 
        }
        }).catch(err=> {
            res.status(500).json({error:err})
        })
    })


users.get('/profile/:id', (req, res) => {
    User.findOne({
        where: {
          id: req.params.id
        },
        include:[Question]
      })
        .then(user => {
          if (user) {
            res.json(user)
          } else {
            res.send('User does not exist')
          }
        })
        .catch(err => {
          res.send('error: ' + err)
        })
})
    
    module.exports = users

