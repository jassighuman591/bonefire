const Campground = require('../models/campground'); 
const Review = require('../models/reviewSchema');

module.exports.createReview = async(req, res, next) => {
    
    const foundCampground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body);
    newReview.author = req.user._id;
    foundCampground.reviews.push(newReview);
    await newReview.save();
    await foundCampground.save();
    req.flash('success', "You reivew has been created")
    res.redirect(`/campgrounds/${foundCampground._id}`);
}

module.exports.deleteReview = async(req, res, next) => {
    const { id, reviewId } = req.params;
    await Campground.findByIdAndUpdate(id, { $pull : { reviews : reviewId }});
    await Review.findByIdAndDelete(reviewId);
    req.flash('success', 'Your review has been deleted.')
    res.redirect(`/campgrounds/${id}`);
}