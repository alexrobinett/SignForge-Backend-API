const multer = require('multer');
const path = require('path');

const allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
const maxSize = 5 * 1024 * 1024; // 5MB

const fileFilter = (req, file, cb) => {
  if (!allowedTypes.includes(file.mimetype)) {
    return cb(new Error('Only .jpg, .png, and .gif files are allowed!'), false);
  }
  cb(null, true);
};

const upload = multer({
  fileFilter,
  limits: { fileSize: maxSize },
});

module.exports = upload;
