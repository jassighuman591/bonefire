const express = require('express');
const mongoose = require('mongoose');
const router = express.Router({mergeParams: true});
const { isLoggedIn, isReviewAuthor } = require('../middleware.js');

//review controller
const reviews = require('../controllers/reviews');

//review Schema
const Campground = require('../models/campground'); 
const Review = require('../models/reviewSchema');


router.post('', isLoggedIn, reviews.createReview);

router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviews.deleteReview);

module.exports = router;