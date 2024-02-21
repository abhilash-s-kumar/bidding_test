const express = require('express');
const router = require('./auth_route');
const { v4: uuidv4 } = require('uuid');
const CustomError = require('../handle/custom_error');
const multer = require('multer')

//* Middleware used for authenticating token
const { authenticateToken } = require('../helpers/auth_helpers/jwt_helper');

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, './public/uploads');
    },
    filename: function (req, file, cb) {
        const originalnameArray = file.originalname.split('.');
        const fileExtension = originalnameArray.pop();
        const randomFilename = uuidv4();
        const newFilename = `${randomFilename}.${fileExtension}`;
        cb(null, newFilename);
    }
});

const upload = multer({ storage: storage });

// Multiple file upload
router.post('/upload', authenticateToken, upload.array('files'), (req, res) => {
    console.log("/upload");
    const lsitOfFiles = [];
    for (let i = 0; i < req.files.length; i++) {
        const filePath = req.files[i].path.replace('public', '');
        lsitOfFiles.push(filePath);
    }
    console.log("lsitOfFiles = " + lsitOfFiles);
    res.status(200).json({
        result: {
            files: lsitOfFiles,
        }
    });
});

// Export the router
module.exports = router;