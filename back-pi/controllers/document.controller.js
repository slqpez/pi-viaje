const Users = require('../models/user.model')
const Documents = require ('../models/document.model')
const cloudinary = require('cloudinary')
const fs = require('fs')

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET

})


const documentController ={

    saveDocuement:  (req, res)=>{
        const {name,userId} = req.body
        try {
            const file = req.files.file
            cloudinary.v2.uploader.upload(file.tempFilePath,{
                folder: "documents"
                
            }
             , async (err, result)=>{
                 try {
                    const file = result.secure_url
                    
                  

                    const user =  await Users.findById(userId)

                    const newDocument = new Documents({
                        name, file, userId: user._id
                    })
                
                  
                   
 
                   const savedDocument= await newDocument.save()
                   console.log(savedDocument)
                    
                   user.notes=  user.notes.concat(savedDocument._id)
                    console.log(user)
    
                    await user.save()
                    
            
                    
                    res.json({savedDocument})

                 } catch (err) {
                    removeTmp(file.tempFilePath)
                    return  err
                 }
             
               

               
            } )
            
        } catch (err) {
            return res.status(500).json({msg: err.message})
        } 
    }
}


const removeTmp = (path)=>{
    fs.unlink(path, err=>{
        if(err) throw err
    })
}

module.exports = documentController