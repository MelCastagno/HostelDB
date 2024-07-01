const express = require('express');
const router = express.Router({ mergeParams: true});
const catchAsync = require('../utils/catchAsync');
const { validateReview, isLoggedIn, isReviewAuthor } = require('../utils/middleware');
const review = require('../controllers/reviews');


router.post('/', 
    isLoggedIn, 
    validateReview, 
    catchAsync( review.create));

router.delete('/:reviewId', 
    isLoggedIn, 
    isReviewAuthor, 
    catchAsync( review.delete ));

module.exports = router;