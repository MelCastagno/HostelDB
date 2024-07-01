const Review = require('../models/review');
const Hostel = require('../models/hostel')


module.exports.create = async (req, res) => {
    const hostel = await Hostel.findById(req.params.id); 
    const review = new Review(req.body.review);
    review.author = req.user._id;
    hostel.reviews.push(review);
    await review.save();
    await hostel.save();
    req.flash('success', 'Created new review!')
    res.redirect(`/hostels/${hostel._id}`);
};

module.exports.delete = async (req, res) => {
    const {id, reviewId} = req.params;
    await Hostel.findByIdAndUpdate(id, {$pull: {reviews: reviewId} });
    await Review.findByIdAndDelete(req.params.reviewId);
    req.flash('success', 'Successfully deleted review!')
    res.redirect(`/hostels/${id}`); 
};