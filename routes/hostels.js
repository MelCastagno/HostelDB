const express = require('express');
const router = express.Router();
const catchAsync = require('../utils/catchAsync');
const {isLoggedIn, isAuthor, validateHostel} = require('../utils/middleware');
const hostel = require('../controllers/hostels');
const multer = require('multer');
const {storage} = require('../cloudinary');
const upload = multer({ storage });


router.route('/')
    .get(catchAsync( hostel.index ))
    .post(isLoggedIn, upload.array('image'), validateHostel, catchAsync( hostel.create));


router.get('/new', 
    isLoggedIn, 
    catchAsync( hostel.renderNewForm));

router.route('/:id')
    .get(catchAsync( hostel.show))
    .put(isLoggedIn, isAuthor, upload.array('image'), validateHostel, catchAsync( hostel.edit))
    .delete( isLoggedIn, isAuthor, catchAsync( hostel.delete));

router.get('/:id/edit', 
    isLoggedIn,
    isAuthor, 
    catchAsync( hostel.editForm));

module.exports = router;