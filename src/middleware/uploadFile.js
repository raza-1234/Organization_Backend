const multer = require('multer');
const path = require('path');

const getDestination = (req, file, cb) => {
  let destinationFolder;
  const fileType = file.mimetype.split('/')[0];
  if (fileType === "image"){
    destinationFolder = 'images';
  } else if (fileType === "audio"){
    destinationFolder = 'audios';
  } else if (fileType === "video"){
    destinationFolder = 'videos';
  } else {
    console.log("GetDestination: Invalid mimetype.", file.mimetype);
    cb({error: "Invalid mimetype."})
  }
  cb(null, path.join(__dirname, '../../Assets', destinationFolder));
}

const storage = multer.diskStorage({
  destination: getDestination,
  filename: (req, file, cb) => {
    return cb(null, `${file.fieldname}_${Date.now()}${path.extname(file.originalname)}`); 
  }
});

const uploadFile = multer({
  storage: storage, 
  limits: { 
    fileSize: 1024 * 1024 * 1024 //1gb
  }
}).single("file");
 
module.exports = {  
  uploadFile 
}