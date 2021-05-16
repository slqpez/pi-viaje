const router = require('express').Router()
const documentController = require('../controllers/document.controller')


router.get("/getAll", documentController.getDocuments)

router.post("/save", documentController.saveDocuement)


module.exports = router