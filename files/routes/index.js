// require
const express = require('express')
const route = express.Router()
const userDataRouter = require('./userData')
const moneyRouter = require('./moneyManagement')

// router
route.use('/users', userDataRouter)
route.use('/saldo', moneyRouter)

// exports
module.exports = route