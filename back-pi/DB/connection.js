const mongoose = require('mongoose')

const URI = process.env.MONGODB_URL

mongoose.connect(URI,{
    useCreateIndex : true,
    useNewUrlParser : true,
    useUnifiedTopology: true,
    useFindAndModify: false


}, err=>{
    if(err) throw err;
    console.log('DB connected');
})

module.exports = mongoose