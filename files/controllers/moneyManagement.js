const moneyModel = require('../models/moneyManagement')
const userDataModel = require('../models/userData')
const bcrypt = require('bcrypt')
const callResult = require('../functions/callResult')

// TOP-UP
exports.topUpUser = (req, res) => {
   const id = req.params.id
   const saldo = req.body.saldo
   try {
      if(isNaN(saldo) === true) { callResult.returnFailed(res, 422, "Top-up saldo harus berupa digit ANGKA yah!") }
      else {
         moneyModel.topUpSaldo(id, saldo)
         .then((result) => { callResult.returnSuccess(res, 200, result) })
         .catch((err) => { callResult.returnFailed(res, 400, err) })
      }
   }
   catch(err) { callResult.returnFailed(res, 500, err.message) }
}

// TRANSFER
exports.transferBetweenUser = (req, res) => {
   const { sender, receiver, saldo, note, pin } = req.body
   try {
      if(isNaN(saldo) === true) { callResult.returnFailed(res, 422, "Input saldo untuk transfer harus berupa digit ANGKA yah!") }
      else if(sender === receiver) { callResult.returnFailed(res, 403, "Pengirim dan penerima transfer tidak boleh orang yang sama!") }
      else if(
         sender === undefined || 
         receiver === undefined || 
         saldo === undefined || 
         note === undefined ||
         pin === undefined){
            callResult.returnFailed(res, 400, "Pastikan selalu ada pengirim, penerima, jumlah saldo yang ingin di kirim, nota transfer, dan konfirmasi PIN untuk setiap transfer!")
         }
      else if(note.length < 1 || note.length > 30) { callResult.returnFailed(res, 403, "Nota transfer harus di isi dan maksimal karakternya adalah sebanyak 30 huruf!") }
      else {
         userDataModel.getUserDataById(sender)
         .then((result) => { 
            const checkPIN = bcrypt.compareSync(pin, result.user_pin)
            if(checkPIN === false) { callResult.returnFailed(res, 401, "Gagal transfer saldo, PIN yang di masukkan salah!") }
            else {
               moneyModel.transferSaldo(sender, receiver, saldo)
               .then((result) => {
                  moneyModel.createTransferHistory(sender, receiver, saldo, note)
                  .then(() => { callResult.returnSuccess(res, 200, result) })
                  .catch((error) => { callResult.returnFailed(res, 400, error) })
               })
               .catch((err) => { callResult.returnFailed(res, 400, err) })
            }
         })
         .catch((err) => { callResult.returnFailed(res, 404, err) })
      }
   }
   catch(err) { callResult.returnFailed(res, 500, err.message) }  
}

// CHECK TRANSFER HISTORY BY USER ID
exports.sortTransferHistoryByQuery = (req, res) => {
   const id = req.query.id
   const page = req.query.page
   const limit = req.query.limit
   const sort = req.query.sort
   moneyModel.checkTransferHistoryByQuery(id, page, limit, sort)
   .then((result) => { callResult.returnSuccess(res, 200, result) })
   .catch((err) => { callResult.returnFailed(res, 404, err) })
}

// DELETE TRANSFER HISTORY
exports.deleteTransferHistory = (req, res) => {
   const transferId = req.params.id
   moneyModel.removeTransferHistory(transferId)
   .then((result) => { callResult.returnSuccess(res, 200, result) })
   .catch((err) => { callResult.returnFailed(res, 404, err) })
}