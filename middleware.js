const Campground = require('./models/campground');
const Review = require('./models/reviewSchema');

module.exports.isLoggedIn = (req, res, next) => {
    if(!req.isAuthenticated()){
        //storing requesting route of user into session as returnTo variable 
        req.session.returnTo = req.originalUrl;
        req.flash('error', 'You must be login first.')
        return res.redirect('/login');
    }
    next();
}

module.exports.isAuthor = async (req, res, next) => {
    const campground = await Campground.findById(req.params.id);
    if(!campground.author.equals(req.user._id)){
        req.flash('error', "You don't have permission to do that.");
        res.redirect(`/campgrounds/${campground._id}`);
    }else{
        next();
    }
}

module.exports.isReviewAuthor = async (req, res, next) => {
    const review = await Review.findById(req.params.reviewId);
    const campground = await Campground.findById(req.params.id);
    if(!review.author.equals(req.user._id)){
        req.flash('error', "You don't have permission to do that.");
        res.redirect(`/campgrounds/${campground._id}`);
    }else{
        next();
    }
}