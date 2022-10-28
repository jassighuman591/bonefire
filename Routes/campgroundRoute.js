const express = require('express');
const mongoose = require('mongoose');
const multer = require('multer');
const { storage } = require('../cloudinary/index');
const upload = multer({ storage }); 
const router = express.Router();
 
//controllers
const campgrounds = require('../controllers/campground');

//campground schema
const Campground = require('../models/campground');
//error handling 
const ExpressError = require('../utils/ExpressError');

//login middleware
const { isLoggedIn, isAuthor } = require('../middleware.js');

router.route('')
    .get(campgrounds.index)
    .post(isLoggedIn, upload.array('image'),  campgrounds.createCampground);


router.get('/new', isLoggedIn, campgrounds.newForm);

router.route('/:id')
    .get(isLoggedIn, campgrounds.showCampground)
    .put(isLoggedIn, isAuthor, upload.array('image'), campgrounds.updateCampground)
    .delete(isLoggedIn, isAuthor, campgrounds.deleteCampground)

router.get('/:id/edit', isLoggedIn, isAuthor, campgrounds.editForm);

module.exports = router;