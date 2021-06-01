const userDataModel = require('../models/userData')
const { v4: uuidv4 } = require('uuid')
const bcrypt = require('bcrypt')
const salt = bcrypt.genSaltSync(10)
const callResult = require('../functions/callResult')
const jwt = require('jsonwebtoken')
const NM = require('../functions/nodemailer')
const cookie = require('cookie')

// create
exports.createUserData = (req, res) => {
   const { name, email, password, pin, phone } = req.body
   const generateUuid = uuidv4()
   try {
      if(isNaN(pin) === true || pin.length !== 6) { callResult.returnFailed(res, 422, "Input PIN harus berupa 6-digit ANGKA yah!") }
      else {
         const hashedUserPassword = bcrypt.hashSync(password, salt)
         const hashedUserPIN = bcrypt.hashSync(pin, salt)
         userDataModel.newUserData(generateUuid, name, email, hashedUserPassword, hashedUserPIN, phone)
         .then((result) => { 
            const payload = { user_id: generateUuid }
            jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 15 }, (err, token) => {
               callResult.returnSuccess(res, 200, {message: result, jwtToken: token})
               NM.sendEmail(token, email, name)
            }) 
         })
         .catch((err) => {
            if(err.code === "23505") { callResult.returnFailed(res, 403, "Email yang ingin digunakan sudah terdaftar!") }
            else { callResult.returnFailed(res, 400, err.detail) }
         })
      }
   } 
   catch (err) { callResult.returnFailed(res, 500, err.message) }
 }

// read
exports.readUserData = (req, res) => {
   userDataModel.getUserData()
   .then((result) => { callResult.returnSuccess(res, 200, result) })
   .catch((err) => { callResult.returnFailed(res, 400, err) })
}
exports.readUserDataById = (req, res) => {
   const userId = req.params.id
   userDataModel.getUserDataById(userId)
   .then((result) => { callResult.returnSuccess(res, 200, result) })
   .catch((err) => { callResult.returnFailed(res, 404, err) })
}

// update - all
exports.updateUserData = (req, res) => {
   const userId = req.params.id
   const { name, phone } = req.body
   try {
      userDataModel.changeUserData(userId, name, phone)
      .then((result) => { callResult.returnSuccess(res, 200, result) })
      .catch((err) => { callResult.returnFailed(res, 400, err) })
      
   } 
   catch (err) { callResult.returnFailed(res, 500, err.message) }
}

// update - each
exports.updateUserPassword = (req, res) => {
   const userId = req.params.id
   const oldPassword = req.body.old_password
   const newPassword = req.body.new_password
   try {
      if(newPassword.length < 8){ callResult.returnFailed(res, 422, "Gagal mengubah password, minimal password baru harus memiliki 8 karakter!") }
      else if (oldPassword === newPassword) { callResult.returnFailed(res, 403, "Gagal mengubah password, input password lama dan input password baru tidak boleh sama!") }
      else {
         userDataModel.getUserDataById(userId)
         .then((result) => { 
            const checkPassword = bcrypt.compareSync(oldPassword, result.user_password)
            if(checkPassword === false) { callResult.returnFailed(res, 401, "Gagal mengubah password, input password lama salah!") }
            else {
               const hashedUserPassword = bcrypt.hashSync(newPassword, salt)
               userDataModel.changeUserPassword(userId, hashedUserPassword)
               .then((result) => { callResult.returnSuccess(res, 200, result) })
               .catch((err) => { callResult.returnFailed(res, 404, err) })
            }
         })
         .catch((err) => { callResult.returnFailed(res, 404, err) })
      }
   } 
   catch (err) { callResult.returnFailed(res, 500, err.message) }
}
exports.updateUserPIN = (req, res) => {
   const userId = req.params.id
   const oldPIN = req.body.old_pin
   const newPIN = req.body.new_pin
   try {
      if(
         isNaN(oldPIN) === true || 
         oldPIN.length !== 6 || 
         isNaN(newPIN) === true || 
         newPIN.length !== 6){ callResult.returnFailed(res, 422, "Gagal mengubah PIN, input PIN lama dan PIN baru harus berupa 6-digit ANGKA yah!") }
      else if (oldPIN === newPIN) { callResult.returnFailed(res, 403, "Gagal mengubah PIN, input PIN lama dan input PIN baru tidak boleh sama!") }
      else {
         userDataModel.getUserDataById(userId)
         .then((result) => { 
            const checkPIN = bcrypt.compareSync(oldPIN, result.user_pin)
            if(checkPIN === false) { callResult.returnFailed(res, 401, "Gagal mengubah PIN, input PIN lama salah!") }
            else {
               const hashedUserPIN = bcrypt.hashSync(newPIN, salt)
               userDataModel.changeUserPIN(userId, hashedUserPIN)
               .then((result) => { callResult.returnSuccess(res, 200, result) })
               .catch((err) => { callResult.returnFailed(res, 404, err) })
            }
         })
         .catch((err) => { callResult.returnFailed(res, 404, err) })
      }
   } 
   catch (err) { callResult.returnFailed(res, 500, err.message) }
}

// delete
exports.deleteUserData = (req, res) => {
   const userId = req.params.id
   userDataModel.removeUserData(userId)
   .then((result) => { callResult.returnSuccess(res, 200, result) })
   .catch((err) => { callResult.returnFailed(res, 404, err) })
}

// user - login
exports.postUserLogin = (req, res) => {
   const { email, password } = req.body
   userDataModel.userLogin(email)
     .then((result) => {
         const checkPassword = bcrypt.compareSync(password, result.user_password)
         if (checkPassword === false) { callResult.returnFailed(res, 401, "Gagal login, password salah!") } 
         else {
            jwt.sign(result, process.env.JWT_SECRET_KEY, { expiresIn: '1h' }, (err, token) => {
               // set cookie
               res.setHeader('Set-Cookie', cookie.serialize('userId', result.user_id, {
                  httpOnly: true,
                  maxAge: 60 * 60,
                  secure: false,
                  path: '/',
                  sameSite: 'strict'
               }));
               callResult.returnSuccess(res, 200, {...result, jwtToken: token})
            })
         }
     })
     .catch((err) => { callResult.returnFailed(res, 404, err) })
 }

 // return jwt token as user login data
 exports.returnLoginTokenAsUserData = (req, res) => {
   const authHeader = req.headers.authorization
   const token = authHeader && authHeader.split(' ')[1]
   if (token === undefined) { callResult.returnFailed(res, 404, "Token JWT tidak boleh kosong!") } 
   else {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
         if(err !== null) {
            let errMsg = ''
            if (err.name === 'JsonWebTokenError') { errMsg = 'Token JWT invalid!' } 
            else if (err.name === 'TokenExpiredError') { errMsg = 'Token JWT sudah expired!' } 
            else { errMsg = 'Token JWT tidak aktif!' }
            callResult.returnFailed(res, 400, errMsg)
         }
         else {
            userDataModel.getUserDataById(user.user_id)
            .then((result) => { callResult.returnSuccess(res, 200, result) })
            .catch((err) => { callResult.returnFailed(res, 404, err) })  
         }
      })
   }
}

// check email
exports.checkIfEmailAlreadyExist = (req, res) => {
   userDataModel.checkEmail(req.body.email)
   .then((result) => { callResult.returnSuccess(res, 200, result) })
   .catch((err) => { callResult.returnFailed(res, 409, err) })
}

// search user by name
exports.searchUserByName = (req, res) => {
   userDataModel.getUserByName(req.query.name)
   .then((result) => { callResult.returnSuccess(res, 200, result) })
   .catch((err) => { callResult.returnFailed(res, 404, err) })
}

// user - upload profile picture
exports.changeUserAvatar = (req, res) => {
   try {
     const userId = req.params.id
     const profilePictureURL = 'http://ciwin-zwallet.herokuapp.com/img/' + req.file.filename
     userDataModel.uploadUserProfilePicture(userId, profilePictureURL)
       .then(() => { callResult.returnSuccess(res, 201, 'Berhasil mengganti gambar profil user!') })
       .catch((err) => { callResult.returnFailed(res, 404, err.message) })
   } 
   catch (err) { callResult.returnFailed(res, 400, 'Gagal mengubah avatar user!') }
 }

 // user - verification
exports.verifyNewUser = (req, res) => {
   const checkJwtToken = req.params.id
   try {
      if (checkJwtToken === null || checkJwtToken == undefined) { res.json({ checkResult: 'Failed', statusCode: 401, errorDetail: 'Invalid JWT token!' }) } else {
         jwt.verify(checkJwtToken, process.env.JWT_SECRET_KEY, (err, user) => {
            cancelCreateUser = (error) => {
               userDataModel.removeUserData(user.user_id)
               .then(() => { res.status(401).json({ checkResult: 'Failed', statusCode: 401, jwtError: error }) })
               .catch((err) => { console.log(err) })
            }
            if (err) {
               let errMsg = ''
               if (err.name === 'JsonWebTokenError') { errMsg = 'Invalid JWT token, canceling account creation!' } else if (err.name === 'TokenExpiredError') { errMsg = 'JWT token already expired, canceling account creation!' } else { errMsg = 'JWT token not active, canceling account creation!' }
               cancelCreateUser(errMsg)
            } 
            else {
               userDataModel.userVerificationSuccess(user.user_id)
               .then(() => { callResult.returnSuccess(res, 200, 'Verifikasi user berhasil, silahkan login!') })
               .catch((err) => { callResult.returnFailed(res, 400, err) })
            }
      })
     }
   } catch (err) { res.send('ERROR : ' + err.message) }
 }

 // reset password
exports.sendResetPasswordMail = (req, res) => {
   try {
     const mail = req.body.userEmail
     if(mail === undefined) { res.status(400).json({ callResult: 'Failed', statusCode: 404, errorMessage: 'Email tidak boleh kosong!' }) }
     else {
       const payload = { mail }
       jwt.sign(payload, process.env.JWT_SECRET_KEY, { expiresIn: 60 * 15 }, (err, token) => {
         statusCode.loginWithJWT(res, 200, mail, token)
         NM.resetPassword(token, mail)
       })
     }
   } catch (err) { res.send('ERROR : ' + err.message) }
 }
 
 exports.checkIfJwtResetValid = (req, res) => {
   const checkJwtToken = req.params.id
   try {
     if (checkJwtToken === null || checkJwtToken == undefined) { res.json({ checkResult: 'Failed', statusCode: 401, errorDetail: 'Invalid JWT token!' }) } else {
       jwt.verify(checkJwtToken, process.env.JWT_SECRET_KEY, (err, user) => {
         cancelCreateUser = (error) => {
           userDataModel.removeUserData("userId")
             .then(() => { res.status(401).json({ checkResult: 'Failed', statusCode: 401, jwtError: error }) })
             .catch((err) => { console.log(err) })
         }
         if (err) {
           console.log(err)
           let errMsg = ''
           if (err.name === 'JsonWebTokenError') { errMsg = 'Invalid JWT token!' } else if (err.name === 'TokenExpiredError') { errMsg = 'JWT token already expired!' } else { errMsg = 'JWT token not active!' }
           cancelCreateUser(errMsg)
         } else {
             statusCode.statRes(res, 201, 'JWT token untuk reset password masih aktif!')
         }
       })
     }
   } catch (err) { res.send('ERROR : ' + err.message) }
 }
 
exports.resetPassword = (req, res) => {
const { checkJwtToken, newPassword, retypePassword } = req.body
console.log(checkJwtToken)
try {
   if (checkJwtToken === null || checkJwtToken == undefined) { res.json({ checkResult: 'Failed', statusCode: 401, errorDetail: 'Invalid JWT token!' }) } else {
      jwt.verify(checkJwtToken, process.env.JWT_SECRET_KEY, (err, user) => {
      if (err) {
         let errMsg = ''
         if (err.name === 'JsonWebTokenError') { errMsg = 'Invalid JWT token!' } else if (err.name === 'TokenExpiredError') { errMsg = 'JWT token already expired!' } else { errMsg = 'JWT token not active!' }
         res.status(400).json({ callResult: 'Failed', statusCode: 400, errorMessage: errMsg })
      } 
      else {
         if(newPassword === undefined || retypePassword === undefined) { res.status(400).json({ callResult: 'Failed', statusCode: 404, errorMessage: 'Password tidak boleh kosong!' }) }
         else { 
            if(newPassword !== retypePassword) {
            res.status(400).json({ callResult: 'Failed', statusCode: 404, errorMessage: 'Proses reset gagal, new password dan retype password masih berbeda, keduanya harus sama!' })
            }
            else if(newPassword.length < 8 || retypePassword.length < 8) { 
            res.status(400).json({ callResult: 'Failed', statusCode: 404, errorMessage: 'Proses reset gagal, panjang password minimal 8 karakter!' })
            }
            else {
            const hashedResetPassword = bcrypt.hashSync(newPassword, salt)
            userDataModel.resetUserPassword(hashedResetPassword, user.mail)
               .then(() => { res.send('Reset password berhasil, silahkan login!') })
               .catch((err) => { res.send(err.message) })
            } 
         }
      }
      })
   }
} catch (err) { res.send('ERROR : ' + err.message) }
}
 