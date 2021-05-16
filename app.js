// first set-ups (require)
require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const port = process.env.PORT || 3000
const host = process.env.DB_HOST
const route = require('./files/routes')
const cookieParser = require('cookie-parser')

// app - settings
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(cors({origin: 'http://localhost:3000', credentials: true}))
app.use(morgan('dev'))
app.use(cookieParser())
app.listen(port, host, () => { console.log('Server telah di-aktivasi dengan port ' + port) })

// routers
app.use('/v1', route)
app.use('/img', express.static('./uploads/images'))