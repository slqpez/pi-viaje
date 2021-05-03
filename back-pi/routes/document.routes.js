const router = require('express').Router()
const documentController = require('../controllers/document.controller')


router.get("/", (req,res)=>{
    res.send("Holita")
})

router.post("/save", documentController.saveDocuement)


module.exports = router