const { Pool } = require('pg')
const connectionString = 'postgres://eveueqaqnuzuxb:fbb19633e6f191adec2f32315921b2085b24a4fecb67aeffb1de2cba9819f70e@ec2-34-225-103-117.compute-1.amazonaws.com:5432/d98u6m56qlfrvv'

const db = new Pool({
   connectionString,
   ssl: {
      rejectUnauthorized: false
   }
})

module.exports = db