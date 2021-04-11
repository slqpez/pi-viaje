const router = require('express').Router()
const userController = require('../controllers/user.controller')
const auth = require("../middlewares/auth")
const authAdmin = require("../middlewares/authAdmin")


router.post('/register',  userController.register)

router.post('/activation',  userController.activateEmail)

router.post('/login',  userController.login)

router.post('/refresh_token',  userController.getAccesToken)

router.post('/forgot',  userController.forgotPassword)

router.post('/reset', auth,  userController.resetPassword)

router.get('/info', auth,  userController.getUserInfo)

router.get('/all_info', auth, authAdmin,  userController.getUsersAllInfo)

router.get('/logout',  userController.logout)

router.patch('/update',  auth, userController.updateUser)

router.patch('/update_rol/:id',  auth, authAdmin, userController.updateUsersRol)

router.delete('/delete/:id',  auth, authAdmin, userController.deleteUser)



router.post('/google_login',  userController.googleLogin)
router.post('/face_login',  userController.faceLogin)




module.exports = router