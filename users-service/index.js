const express = require('express')
const app = express();
const cors = require('cors')
const usersRouter = require('./controllers/users.controller')

require('dotenv').config()
require('./DB/DBConnection.js')
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT

app.use( usersRouter)



app.get('/', (req,res)=>{
    res.send("Users server")
})

app.listen(PORT,()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})