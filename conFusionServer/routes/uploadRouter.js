const express = require('express');
const bodyParser = require('body-parser');
const authenticate = require('../authenticate');
const multer = require('multer');
const cors = require('./cors');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/images');
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});

const imageFileFilter = (req, file, cb) => {
    // not a valid image extension
    if (!file.originalname.match(/\.(jpg|jpeg|png|gif)$/)) {
        return cb(new Error('You can only upload image files in jpg, jpeg, png or gif format!'), false);
    }
    cb(null, true);
};

const upload = multer({
    storage: storage,
    fileFilter: imageFileFilter
});

const uploadRouter = express.Router();

uploadRouter.use(bodyParser.json());

uploadRouter.route('/')
    .options(cors.corsWithOptions, (_req, res) => {
        res.sendStatus(200);
    })
    .get(cors.cors, authenticate.verifyUser, authenticate.verifyAdmin, (_req, res) => {
        res.statusCode = 403;
        res.end('GET operation not supported on /imageUpload');
    })
    .put(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (_req, res) => {
        res.statusCode = 403;
        res.end('PUT operation not supported on /imageUpload');
    })
    // allow upload of a single image file from multi-part form upload
    .post(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, upload.single('imageFile'), (req, res) => {
        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json');
        res.json(req.file);
    })
    .delete(cors.corsWithOptions, authenticate.verifyUser, authenticate.verifyAdmin, (_req, res) => {
        res.statusCode = 403;
        res.end('DELETE operation not supported on /imageUpload');
    });

module.exports = uploadRouter;