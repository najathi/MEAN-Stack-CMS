const multer = require('multer');

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg'
};

// multer configuring
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log('29 routes posts.js: file', file);
    const isValid = MIME_TYPE_MAP[file.mimetype];
    console.log('29 routes posts.js: isValid', isValid);
    let error = null;
    if (!isValid) {
      error = new Error("Invalid mime type");
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    console.log('25 routes posts.js: file', file);
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    console.log('29 routes posts.js: ext', ext);
    cb(null, name + '-' + Date.now() + "." + ext);
  }
});

module.exports = multer({storage: storage}).single('image');
