require('dotenv').config()
const mongoose = require('mongoose');



mongoose.connect(process.env.DB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
    useCreateIndex: true

})
    .then(()=>{
        console.log("Database connected");
    })
    .catch(error=>{
        console.error("Error:", error)
    })

    module.exports = mongoose