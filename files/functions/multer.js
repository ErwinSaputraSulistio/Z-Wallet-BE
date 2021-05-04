const multer = require('multer')

// avatar
const diskStorageAvatar = multer.diskStorage({
  destination: function (req, file, cb) { cb(null, './uploads/images') },
  filename: function (req, file, cb) { cb(null, Date.now() + '-' + file.originalname) }
})
const multerAvatar = multer({
  storage: diskStorageAvatar,
  fileFilter: (req, file, cb) => {
    if (file.mimetype == 'image/png' || file.mimetype == 'image/jpg' || file.mimetype == 'image/jpeg') { cb(null, true) } else {
      cb(null, false)
      cb(new Error('Format file harus .png, .jpg, atau .jpeg!'))
    }
  },
  limits: { fileSize: (1 * 1024 * 1024) } // max size gambar - 1 MB
})

const uploadAvatarMulter = multerAvatar.single('user_image')

exports.uploadAvatar = (req, res, next) => {
  uploadAvatarMulter(req, res, (err) => {
    if(err) {
      console.log(err)
      return res.status(400).json({ callResult: "Failed", statusCode: 400, errorMessage: err.message })}
    else { next() }
  })
}
