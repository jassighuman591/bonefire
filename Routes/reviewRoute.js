const express = require('express');
const mongoose = require('mongoose');
const router = express.Router({mergeParams: true});

const { isLoggedIn, isReviewAuthor } = require('../middleware.js');

//review Schema
const Campground = require('../models/campground'); 
const Review = require('../models/reviewSchema');


router.post('', isLoggedIn, async(req, res, next) => {
    
    const foundCampground = await Campground.findById(req.params.id);
    const newReview = new Review(req.body);
    newReview.author = req.user._id;
    foundCampground.reviews.push(newReview);
    await newReview.save();
    await foundCampground.save();
    req.flash('success', "You reivew has been created")
    res.redirect(`/campgrounds/${foundCampground._id}`);

})

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, async(req, res, next) => {
   const { id, reviewId } = req.params;
   await Campground.findByIdAndUpdate(id, { $pull : { reviews : reviewId }});
   await Review.findByIdAndDelete(reviewId);
   req.flash('success', 'Your review has been deleted.')
   res.redirect(`/campgrounds/${id}`);
})

module.exports = router;