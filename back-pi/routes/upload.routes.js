const router = require('express').Router()
const uploadImage = require('../middlewares/uploadImage')
const uploadController = require('../controllers/upload.controller')
const auth = require('../middlewares/auth')

router.post('/upload_avatar', uploadImage,auth,  uploadController.uploadAvatar)

module.exports = router