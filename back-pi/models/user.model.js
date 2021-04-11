const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    username:{
        type: String,
        required: [true, "Por favor ingrese su nombre de usuario."],
        trim: true
    },
    email:{
        type: String,
        required: [true, "Por favor ingrese su correo."],
        trim: true,
        unique: true
    },
    password:{
        type: String,
        required: [true, "Por favor ingrese su contraseña."],
        trim: true
    },
    role:{
        type: Number,
        default:0,
       
    },
    avatar:{
        type: String,
        default: "https://res.cloudinary.com/slqpez/image/upload/v1617846108/user_k1v8d4.png"
        
    }

},{
    timestamp: true
})

module.exports = mongoose.model("User", UserSchema)