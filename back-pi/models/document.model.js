const mongoose = require('mongoose');

const DocumentSchema = new mongoose.Schema({


    name: {
        type:String,
        required: [true, "Por favor ingrese el nombre del documento."]
    },
    file:{
        type: String,
    },
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref:"User"
    }
    
},{
    timestamp: true
})

module.exports = mongoose.model("Document", DocumentSchema)