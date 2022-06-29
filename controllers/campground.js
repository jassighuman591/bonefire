const Campground = require('../models/campground');

module.exports.index = async (req, res, next) => {
    try {
        const allCamps = await Campground.find({ })
        res.render('campgrounds/home', { allCamps } )        
    } catch (err) {
        next(err);
    }
}

module.exports.newForm = (req, res) => {
    res.render('campgrounds/new');
}

module.exports.createCampground = async (req, res, next) => {
    try {
        const newCampground = new Campground(req.body)
        newCampground.author = req.user._id;
        await newCampground.save();
        req.flash('success', 'New Camp Successfully created')
    res.redirect(`/campgrounds/${newCampground._id}`)
    } catch (err) {
       next(err); 
    } 
}

module.exports.showCampground = async (req, res, next) => {
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
}

module.exports.editForm = async (req, res, next) => {
    try {
        const id = req.params.id;
        const campground = await Campground.findById(id);
        res.render('campgrounds/edit', { campground });       
    } catch (err) {
        next(err);
    }
}

module.exports.updateCampground = async (req, res, next) => {
    try {

        await Campground.findByIdAndUpdate(req.params.id, req.body)
        req.flash('success', 'Camp updated')
        res.redirect(`/campgrounds/${req.params.id}`)      
    } catch (err) {
        next(err);
    }
}

module.exports.deleteCampground = async (req, res, next) => { 
    try {
        await  Campground.findByIdAndDelete(req.params.id)
        req.flash('sucess', 'Camp has been Deleted.')
        res.redirect('/campgrounds')
        
    } catch (err) {
        next(err);
    }
}