const usersRouter = require('express').Router()
const User = require('../models/User.js')

usersRouter.get('/api/users', (req, res)=>{
    User.find({})
        .then(users=>{
            res.json(users)
        })
})

usersRouter.post('/api/users', (req, res)=>{
    res.send("Hello from users")
})


module.exports = usersRouter