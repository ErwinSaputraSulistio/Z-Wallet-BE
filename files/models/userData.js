const db = require('../configs/db')

// create
exports.newUserData = (uuid, name, email, password, pin, phone) => {
   const newUserQuery = 
      "INSERT INTO user_data(user_id, user_name, user_email, user_password, user_pin, user_phone, user_saldo, created_at, updated_at, user_image, verified) VALUES('" 
      + uuid + "','" + name + "','" + email + "','" + password + "','" + pin + "','" + phone 
      + "', 0, current_timestamp, current_timestamp, 'https://t4.ftcdn.net/jpg/00/64/67/63/360_F_64676383_LdbmhiNM6Ypzb3FM4PPuFP9rHe7ri8Ju.jpg', false)"
   return new Promise((resolve, reject) => { 
      db.query(newUserQuery, (err, result) => {
         if (!err) { resolve("Berhasil membuat user baru, silahkan verifikasi email dahulu agar bisa login!") } 
         else { reject(err) } 
      }) 
   })
}

// read
exports.getUserData = () => {
   return new Promise((resolve, reject) => {
      db.query('SELECT * FROM user_data ORDER BY id ASC', (err, result) => {
         if (!err) { resolve(result.rows) } else { reject(err) }
      })
   })
}
exports.getUserDataById = (userId) => {
   return new Promise((resolve, reject) => {
      db.query("SELECT * FROM user_data WHERE user_id = '" + userId + "'", (err, result) => {
         if(result.rows.length === 0) { reject('Tidak dapat menemukan user dengan ID yang dicari!') }
         else if (err) { reject(err) }
         else { resolve(...result.rows) }
      })
   })
}

// update - all
exports.changeUserData = (id, name, phone) => {
   const updateUserQuery = 
      "UPDATE user_data SET user_name = '" + name + 
      "', user_phone = '" + phone + 
      "' WHERE user_id = '" + id + "'"
   return new Promise((resolve, reject) => {
      db.query("SELECT * FROM user_data WHERE user_id = '" + id + "'", (err, result) => {
         if(result.rows.length === 0) { reject('Tidak dapat menemukan user dengan ID yang dicari!') }
         else if (err) { reject(err) }
         else { 
            db.query(updateUserQuery, (err, result) => {
               if (!err) { resolve("Berhasil mengubah data user!") } 
               else { reject(err) } 
            }) 
         }
      }) 
   })
}

// update - each
exports.changeUserPassword = (id, password) => {
   const updatePasswordQuery = "UPDATE user_data SET user_password = '" + password + "' WHERE user_id = '" + id + "'"
   return new Promise((resolve, reject) => {
      db.query("SELECT * FROM user_data WHERE user_id = '" + id + "'", (err, result) => {
         if(result.rows.length === 0) { reject('Tidak dapat menemukan user dengan ID yang dicari!') }
         else if (err) { reject(err) }
         else { 
            db.query(updatePasswordQuery, (err, result) => {
               if (!err) { resolve("Berhasil mengubah password user!") } 
               else { reject(err) } 
            }) 
         }
      }) 
   })
}
exports.changeUserPIN = (id, pin) => {
   const updatePINQuery = "UPDATE user_data SET user_pin = '" + pin + "' WHERE user_id = '" + id + "'"
   return new Promise((resolve, reject) => {
      db.query("SELECT * FROM user_data WHERE user_id = '" + id + "'", (err, result) => {
         if(result.rows.length === 0) { reject('Tidak dapat menemukan user dengan ID yang dicari!') }
         else if (err) { reject(err) }
         else { 
            db.query(updatePINQuery, (err, result) => {
               if (!err) { resolve("Berhasil mengubah PIN user!") } 
               else { reject(err) } 
            }) 
         }
      }) 
   })
}

// delete
exports.removeUserData = (id) => {
   const deleteUserQuery = "DELETE FROM user_data WHERE user_id = '" + id + "'"
   return new Promise((resolve, reject) => {
      db.query("SELECT * FROM user_data WHERE user_id = '" + id + "'", (err, result) => {
         if(result.rows.length === 0) { reject('Tidak dapat menemukan user dengan ID yang dicari!') }
         else if (err) { reject(err) }
         else { 
            db.query(deleteUserQuery, (err, result) => {
               if (!err) { resolve("Berhasil menghapus data user!") } 
               else { reject(err) } 
            }) 
         }
      })
   })
}

// login
exports.userLogin = (email) => {
   return new Promise((resolve, reject) => {
      db.query("SELECT * FROM user_data WHERE user_email = '" + email + "'", (err, result) => {
         if (result.rows.length === 0) { reject("Gagal login, email belum terdaftar!") } 
         else if (result.rows[0].verified === false) { reject("Gagal login, email belum di verifikasi!") }
         else { resolve(...result.rows) }
      })
   })
 }

// check if email already exist
exports.checkEmail = (email) => {
   return new Promise((resolve, reject) => {
      db.query("SELECT * FROM user_data WHERE user_email = '" + email + "'", (err, result) => {
         if(result.rows.length == 0) { resolve("Email ini bisa di gunakan!") }
         else { reject("Email yang ingin di gunakan sudah ada!") } 
      })
   })
}

// search user by name
exports.getUserByName = (name) => {
   return new Promise((resolve, reject) => {
      db.query("SELECT * FROM user_data WHERE user_name ILIKE '%" + name + "%' ORDER BY user_name ASC LIMIT 3", (err, result) => {
         if (result.rows.length !== 0) { resolve(result.rows) } else { reject('Tidak dapat menemukan user dengan nama yang di cari!') }
      })
   })
 }

 // user - upload profile picture
exports.uploadUserProfilePicture = (userId, profilePicture) => {
   return new Promise((resolve, reject) => {
      db.query("UPDATE user_data SET user_image = '" + profilePicture + "' WHERE user_id = '" + userId + "'", (err, result) => {
         if (!err) { resolve(result) } else { reject(err) }
      })
   })
 }
 
// user - verification success
exports.userVerificationSuccess = (userId) => {
   return new Promise((resolve, reject) => {
     db.query("UPDATE user_data SET verified = true WHERE user_id = '" + userId + "'", (err, result) => {
       if (!err) { resolve(result) } else { reject(err) }
     })
   })
}

// user - reset password
exports.resetUserPassword = (userpassword, useremail) => {
   return new Promise((resolve, reject) => {
     db.query("UPDATE user_data SET user_password = '" + userpassword + "' WHERE user_email = '" + useremail + "'", (err, result) => {
       if (!err) { resolve(result.rows) } else { reject(err) }
     })
   })
 }
 
 