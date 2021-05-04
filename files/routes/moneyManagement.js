// require
const express = require('express')
const router = express.Router()
const moneyController = require('../controllers/moneyManagement')
const jwtCheck = require('../functions/JWT')

// router
router
   .post('/top-up/:id', jwtCheck.verifyJwtToken, moneyController.topUpUser)
   .post('/transfer', jwtCheck.verifyTransfer, moneyController.transferBetweenUser)
   .get('/history', moneyController.sortTransferHistoryByQuery)
   .delete('/history/:id', moneyController.deleteTransferHistory)

// exports
module.exports = router