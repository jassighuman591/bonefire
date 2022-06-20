const express = require('express');
const mongoose = require('mongoose');
const router = express.Router();

//campground schema
const Campground = require('../models/campground');
//error handling 
const ExpressError = require('../utils/ExpressError');

//login middleware
const { isLoggedIn, isAuthor } = require('../middleware.js');

router.get('', async (req, res, next) => {
    try {
        const allCamps = await Campground.find({ })
        res.render('campgrounds/home', { allCamps } )        
    } catch (err) {
        next(err);
    }
})

router.get('/new', isLoggedIn, (req, res) => {
    res.render('campgrounds/new');
})

router.post('', isLoggedIn, async (req, res, next) => {
    try {
        const newCampground = new Campground(req.body)
        newCampground.author = req.user._id;
        await newCampground.save();
        req.flash('success', 'New Camp Successfully created')
    res.redirect(`/campgrounds/${newCampground._id}`)
    } catch (err) {
       next(err); 
    }
    
})


router.get('/:id', isLoggedIn, async (req, res, next) => {
    try {        
        const id = req.params.id;
        const campground = await Campground.findById(id).populate(
            { 
                path : 'reviews',
                populate : {
                    path : 'author'
                }
            }).populate('author');
        res.render('campgrounds/show', { campground });
    } catch (err) {
        next(err);
    }
})

router.put('/:id', isLoggedIn, isAuthor, async (req, res, next) => {
    try {

        await Campground.findByIdAndUpdate(req.params.id, req.body)
        req.flash('success', 'Camp updated')
        res.redirect(`/campgrounds/${req.params.id}`)      
    } catch (err) {
        next(err);
    }
})

router.delete('/:id', isLoggedIn, isAuthor, async (req, res, next) => { 
    try {
        await  Campground.findByIdAndDelete(req.params.id)
        req.flash('sucess', 'Camp has been Deleted.')
        res.redirect('/campgrounds')
        
    } catch (err) {
        next(err);
    }
})

router.get('/:id/edit', isLoggedIn, isAuthor, async (req, res, next) => {
    try {
        const id = req.params.id;
        const campground = await Campground.findById(id);
        res.render('campgrounds/edit', { campground });       
    } catch (err) {
        next(err);
    }
})

module.exports = router;