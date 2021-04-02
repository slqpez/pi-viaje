const {Schema, model}= require('mongoose')

const userSchema = new Schema({
    username: String,
    name: String,
    passwordHash: String,
    documents: [String]
    /* documents:[{
        type: Schema.Types.ObjectID,
        ref: "Document"
    }] */
})

userSchema.set('toJSON',{
    transform: (document, returnedObject)=>{
        returnedObject.id =returnedObject._id
        delete returnedObject._id
        delete returnedObject.__v
        delete returnedObject.passwordHash
    }
})

const User = model('User', userSchema)

module.exports = User