// require
const express = require('express')
const router = express.Router()
const userDataController = require('../controllers/userData')
const jwtCheck = require('../functions/JWT')
const { uploadAvatar } = require('../functions/multer')

// router
router
   .post('/', userDataController.createUserData)
   .get('/', userDataController.readUserData)
   .get('/:id', userDataController.readUserDataById)
   .put('/:id', jwtCheck.verifyJwtToken, userDataController.updateUserData)
   .patch('/change/password/:id', jwtCheck.verifyJwtToken, userDataController.updateUserPassword)
   .patch('/change/pin/:id', jwtCheck.verifyJwtToken, userDataController.updateUserPIN)
   .delete('/:id', jwtCheck.verifyJwtToken, userDataController.deleteUserData)
   .post('/login', userDataController.postUserLogin)
   .post('/jwt', userDataController.returnLoginTokenAsUserData)
   .post('/check', userDataController.checkIfEmailAlreadyExist)
   .get('/all/search', userDataController.searchUserByName)
   .patch('/change/avatar/:id', jwtCheck.verifyJwtToken, uploadAvatar, userDataController.changeUserAvatar)
   .get('/verify/:id', userDataController.verifyNewUser)
   .post('/reset/send-mail', userDataController.sendResetPasswordMail)
   .put('/reset/new-password', userDataController.resetPassword)
   .get('/reset/:id', userDataController.checkIfJwtResetValid)

// exports
module.exports = router