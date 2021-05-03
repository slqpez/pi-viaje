require('dotenv').config()
const express = require('express')
const favicon = require('express-favicon');
require("./DB/connection.js")
const cors = require('cors')
const cookieParser = require('cookie-parser')
const fileUpload = require('express-fileupload')
const path = require('path')

const userRouter = require("./routes/user.routes")
const uploadRouter = require('./routes/upload.routes')
const documentRouter = require("./routes/document.routes")





const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())

app.use(fileUpload({
    useTempFiles:true,

}))

//app.use(favicon(__dirname + '/build/favicon.ico'));

/* app.use(express.static(__dirname));
app.use(express.static(path.join(__dirname, 'build')));

app.get('/*', function (req, res) {
  res.sendFile(path.join(__dirname, 'build', 'index.html'));
}); */

app.use("/user", userRouter)
app.use("/api", uploadRouter)
app.use("/document", documentRouter)

app.get("/", (req, res)=>{
    res.send("Back PI")
})

const PORT = process.env.PORT 
console.log(PORT)

app.listen(PORT, ()=>{
    console.log(`Server running on http://localhost:${PORT}`)
})