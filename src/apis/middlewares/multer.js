const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cloudinary = require('cloudinary').v2;

cloudinary.config({
    cloud_name: 'dchcxvy2k',
    api_key: '457724698749987',
    api_secret: 'btqtgge4rEJMrhbZtl1jLlnF0es'
})

const storage = multer.diskStorage({
    destination: path.join(__dirname, "profile"),
    filename: (req, file, cb) => {
        cb(null, `${file.fieldname}_${Date.now()}_${file.originalname}`);
    }
});

const upload = multer({ storage });

const uploadImage = (req, res, next) => {
    upload.single('image')(req, res, async (err) => {
        if (err) {
            return res.status(404).json({
                status: 'error',
                message: err.message
            });
        }

        if (req.file) {
            try {
                const result = await cloudinary.uploader.upload(req.file.path, {
                    folder: 'Images'
                });
                req.body.image = result.secure_url;

                fs.unlink(req.file.path, (unlinkError) => {
                    if (unlinkError) console.log(`Error deleting local file: ${unlinkError.message}`);
                });

                next();
            } catch (error) {
                console.error('Cloudinary upload error:', error);
                next(error);
            }
        } else {
            next();
        }
    });
};

module.exports = uploadImage;
