
const multer = require('multer');
const path = require('path');


const storage = multer.diskStorage({

  destination: function (req, file, cb) 
      {
        cb(null, "uploads");
      },

  filename: (req, file, cb) => {

    cb(null, `${Date.now()}-${file.originalname}`);

  },
});


// File validation for images and PDFs
const fileFilter = (req, file, cb) => {
  const allowedTypes = /jpeg|jpg|png|pdf/;
  const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
  const mimetype = allowedTypes.test(file.mimetype);

  if (extname && mimetype) {
    cb(null, true);
  } else {
    console.log('File rejected:', file.originalname);
    cb(new Error('Only PDF, JPG, JPEG, or PNG files are allowed'), false);
  }
};


const upload = multer({
  storage,
  fileFilter,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB file size limit
});



const uploadForIndividual = upload.fields([
    { name: 'frontID', maxCount: 1 },
    { name: 'backID', maxCount: 1 },
  ]);

  const uploadForShop = upload.fields([
    { name: 'frontID', maxCount: 1 },
    { name: 'backID', maxCount: 1 },
    { name: 'shopPicture', maxCount: 1 },
  ]);


  module.exports = {uploadForIndividual,uploadForShop};









