module.exports =((err, req, res, next)=>{
    console.log(err)

    if(error.name=== "CastError"){
        res.status(400).send({error:"Id used is malformed"})
    }else{
        res.status(500).end()
    }
    
})
  