const express = require('express')
const app = express();
const cors = require('cors')
const path = require('path');
const usersRouter = require('./controllers/users.controller')
const loginRouter = require('./controllers/login.controller')
const bodyParser = require('body-parser')
app.use(express.json())
require('dotenv').config()
require('./DB/DBConnection.js')
app.use(cors())


app.use(favicon(__dirname + '/build/favicon.ico'));

app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

const PORT = process.env.PORT

app.use("/api/users", usersRouter)
app.use("/api/login", loginRouter)



app.get('/', (req,res)=>{
    res.send("Users server")
})

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})

module.exports = app