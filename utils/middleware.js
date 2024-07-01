const { hostelSchema, reviewSchema } = require('../schemas');
const ExpressError = require('./ExpressError');
const Hostel = require('../models/hostel');
const Review = require('../models/review');

module.exports.isLoggedIn = (req, res, next) => {
    if (!req.isAuthenticated()) {
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be signed in first!');
        return res.redirect('/login');
    }
    next();
};

module.exports.storeReturnTo = (req, res, next) => {
    if (req.session.returnTo) {
        res.locals.returnTo = req.session.returnTo;
    }
    next();
};

module.exports.validateHostel = (req, res, next) => {
    const {error} = hostelSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    };
};

module.exports.isAuthor = async (req, res, next) => {
    const {id} = req.params;
    const hostel = await Hostel.findById(id);
    if (!hostel.author.equals(req.user._id)){
        req.flash('error', 'You do not own this post!');
        return res.redirect(`/hostels/${hostel._id}`)
    }
    next();
};

module.exports.validateReview = (req, res, next) => {
    const  {error } = reviewSchema.validate(req.body);
    if (error){
        const msg = error.details.map(el => el.message).join(',');
        throw new ExpressError(msg, 400)
    } else {
        next();
    };
};

module.exports.isReviewAuthor = async (req, res, next) => {
    const {id, reviewId} = req.params;
    const review = await Review.findById(reviewId);
    if (!review.author.equals(req.user._id)){
        req.flash('error', 'You do not own this post!');
        return res.redirect(`/hostels/${id}`)
    }
    next();
};
