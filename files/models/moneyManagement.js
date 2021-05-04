const db = require('../configs/db')

// TOP-UP
exports.topUpSaldo = (id, money) => {
   return new Promise((resolve, reject) => {
      db.query("SELECT * FROM user_data WHERE user_id = '" + id + "'", (err, result) => {
         if(result.rows.length === 0) { reject('Tidak dapat menemukan user dengan ID yang dicari!') }
         else{
            const topUpQuery = "UPDATE user_data SET user_saldo = user_saldo + " + money + " WHERE user_id = '" + id + "'"
            db.query(topUpQuery, (err, result) => {
               if (!err) { resolve("Berhasil top-up saldo user dengan ID " + id + ", dan saldo yang di top-up memiliki nominal sebanyak " + money + "!") } 
               else { reject(err) } 
            })
         }
      })
   })
}

// TRANSFER
exports.transferSaldo = (sender, receiver, saldo) => {
   return new Promise((resolve, reject) => {
      db.query("SELECT * FROM user_data WHERE user_id = '" + sender + "'", (err, result) => {
         if(result.rows.length === 0) { reject('Tidak dapat menemukan ID user yang akan menjadi pengirim saldo!') }
         else {
            if(result.rows[0].user_saldo < saldo) { reject('Total saldo pengirim kurang dari jumlah saldo yang ingin di kirim!') }
            else {
               db.query("SELECT * from user_data WHERE user_id = '" + receiver + "'", (err, result) => {
                  if(result.rows.length === 0) { reject('Tidak dapat menemukan ID user yang akan menjadi penerima saldo!') }
                  else {
                     const senderQuery = "UPDATE user_data SET user_saldo = user_saldo - " + saldo + " WHERE user_id = '" + sender + "'"
                     const receiverQuery = "UPDATE user_data SET user_saldo = user_saldo + " + saldo + " WHERE user_id = '" + receiver + "'"
                     db.query(senderQuery, (err, result) => {
                        if (!err) { console.log("SENT : User ID " + sender + " berhasil mengirim saldo sebesar " + saldo + " kepada user ID " + receiver + "!") } 
                        else { reject(err) } 
                     })
                     db.query(receiverQuery, (err, result) => {
                        if (!err) { 
                           console.log("RECEIVED : User ID " + receiver + " baru saja menerima saldo sebesar " + saldo + " dari user ID " + sender + "!")
                           resolve("Transfer saldo sebesar " + saldo + " berhasil di lakukan, dan sukses membuat histori transfer ini!") 
                        } 
                        else { reject(err) } 
                     })
                  }
               })
            }
         }
      })
   })
}

// CREATE TRANSFER HISTORY
exports.createTransferHistory = (sender, receiver, saldo, note) => {
   const createTransferQuery = 
         "INSERT INTO transfer_history(sender_id, receiver_id, transfer_saldo, transfer_note, created_at) "
         + "VALUES('" + sender + "','" + receiver + "'," + saldo + ",'" + note + "',current_timestamp)"
   return new Promise((resolve, reject) => { 
      db.query(createTransferQuery, (err, result) => {
         if (!err) { resolve("Berhasil membuat histori transfer!") } 
         else { reject(err) }
      })
    })
}
// CHECK TRANSFER HISTORY BY ID
exports.checkTransferHistoryByQuery = (id, page = 1, limit = 3, sort) => {
   let newTransferQuery =
      "FROM (SELECT CASE WHEN sender_id = '" + id + "' \
      THEN JSON_BUILD_OBJECT(\
         'role', 'Sender', \
         'user_image', receiver.user_image, \
         'user_name', receiver.user_name, \
         'id', transaction_id, \
         'transfer_saldo', transfer_saldo, \
         'transfer_note', transfer_note, \
         'created_at', transfer_history.created_at) \
      ELSE JSON_BUILD_OBJECT(\
         'role', 'Receiver', \
         'user_image', sender.user_image, \
         'user_name', sender.user_name, \
         'id', transaction_id, \
         'transfer_saldo', transfer_saldo, \
         'transfer_note', transfer_note, \
         'created_at', transfer_history.created_at) \
      END AS login_role from transfer_history \
      INNER JOIN user_data sender ON sender.user_id = sender_id \
      INNER JOIN user_data receiver ON receiver.user_id = receiver_id \
      WHERE sender_id = '" + id + "' \
      OR receiver_id = '" + id + "' ORDER BY transfer_history.created_at DESC) AS transfer_history"
   if(sort !== undefined) { newTransferQuery += " WHERE login_role->>'role' = '" + sort + "'" }
   return new Promise((resolve, reject) => {
      db.query("SELECT COUNT(*) " + newTransferQuery, (err, result) => {
         const totalPage = (Math.ceil(result.rows[0].count / limit))
         db.query("SELECT * " + newTransferQuery + " OFFSET " + ((page - 1) * limit) + " LIMIT " + limit, (err, result) => {
            if(result.rows.length === 0) { reject('Tidak dapat menemukan histori dengan ID yang di cari!') }
            else if (!err) { resolve([result.rows, {totalPage: totalPage}]) }
            else { reject(err) }
         })
      })
   })
}

// DELETE TRANSFER HISTORY
exports.removeTransferHistory = (id) => {
   const deleteTransferQuery = "DELETE FROM transfer_history WHERE transaction_id = " + id
   return new Promise((resolve, reject) => {
      db.query("SELECT * FROM transfer_history WHERE transaction_id = " + id, (err, result) => {
         if(result.rows.length === 0) { reject('Tidak dapat menemukan transaksi dengan ID yang dicari!') }
         else if (err) { reject(err) }
         else { 
            db.query(deleteTransferQuery, (err, result) => {
               if (!err) { resolve("Berhasil menghapus data transaksi!") } 
               else { reject(err) } 
            }) 
         }
      })
   })
}