const express = require('express')
const app = express();
const cors = require('cors')
const usersRouter = require('./controllers/users.controller')
const bodyParser = require('body-parser')
app.use(express.json())
require('dotenv').config()
require('./DB/DBConnection.js')
app.use(cors())


const PORT = process.env.PORT

app.use("/api/users", usersRouter)



app.get('/', (req,res)=>{
    res.send("Users server")
})

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})

module.exports = app