const jwt = require('jsonwebtoken')
const callResult = require('./callResult')

// JWT - verify
exports.verifyJwtToken = (req, res, next) => {
   console.log(req.cookies)
   const userId = req.params.id
   const authHeader = req.headers.authorization
   const token = authHeader && authHeader.split(' ')[1]
   if (token === undefined) { res.json({ checkResult: 'Failed', statusCode: 401, errorDetail: "Token JWT tidak boleh kosong!" }) } 
   else {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
         return new Promise((resolve, reject) => {
            if(err) {
               let errMsg = ''
               if (err.name === 'JsonWebTokenError') { errMsg = 'Token JWT invalid!' } 
               else if (err.name === 'TokenExpiredError') { errMsg = 'Token JWT sudah expired!' } 
               else { errMsg = 'Token JWT tidak aktif!' }
               reject(errMsg)
            } 
            else if(userId !== user.user_id) { callResult.returnFailed(res, 403, "Tidak dapat menggunakan token login JWT milik user lain!") }
            else { resolve(user) }
         })
         .then((res) => {
            req.user = res
            next()
         })
         .catch((err) => { res.status(401).json({ checkResult: 'Failed', statusCode: 401, jwtError: err }) })
      })
   }
}

// JWT - check transfer
exports.verifyTransfer = (req, res, next) => {
   const authHeader = req.headers.authorization
   const token = authHeader && authHeader.split(' ')[1]
   if (token === undefined) { res.json({ checkResult: 'Failed', statusCode: 401, errorDetail: "Token JWT tidak boleh kosong!" }) } 
   else {
      jwt.verify(token, process.env.JWT_SECRET_KEY, (err, user) => {
         return new Promise((resolve, reject) => {
            if(err) {
               let errMsg = ''
               if (err.name === 'JsonWebTokenError') { errMsg = 'Token JWT invalid!' } 
               else if (err.name === 'TokenExpiredError') { errMsg = 'Token JWT sudah expired!' } 
               else { errMsg = 'Token JWT tidak aktif!' }
               reject(errMsg)
            } 
            else if(req.body.sender !== user.user_id) { callResult.returnFailed(res, 403, "Tidak dapat menggunakan token login JWT milik user lain!") }
            else { resolve(user) }
         })
         .then((res) => {
            req.user = res
            next()
         })
         .catch((err) => { res.status(401).json({ checkResult: 'Failed', statusCode: 401, jwtError: err }) })
      })
   }
}