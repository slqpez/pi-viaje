const fs = require('fs')
//TODO configurarlo para que sea un documento
module.exports = async function(req,res,next){
    try {
        if(!req.files || Object.keys(req.files).length=== 0)
             return res.status(400).json({msg: "No se subió ningún archivo."})
        const file = req.files.file;

        console.log(file, file)
        if(file.size > 1024 * 1024){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "El tamaño del archivo es demasiado grande."})
        }
        if(file.mimetype !== 'image/png' && file.mimetype !== 'image/jpeg'){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "El formato del archivo es inválido."})
        }

        next()
    } catch (err) {
        return res.status(500).json({msg: err.message})
    }
}

const removeTmp = (path)=>{
    fs.unlink(path, err=>{
        if(err) throw err
    })
}