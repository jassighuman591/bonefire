const Campground = require('../models/campground');
const { cloudinary } = require("../cloudinary");

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
        newCampground.image = req.files.map( f => ({ url : f.path, filename : f.filename}));
        newCampground.author = req.user._id;
        await newCampground.save();
        console.log(newCampground);
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

        const campground = await Campground.findByIdAndUpdate(req.params.id, req.body)
        const imgs = req.files.map(f => ({ url: f.path, filename: f.filename }));
        campground.image.push(...imgs)
        await campground.save();
        if (req.body.deleteImages) {
            for (let filename of req.body.deleteImages) {
                await cloudinary.uploader.destroy(filename);
            }
            await campground.updateOne({ $pull: { image: { filename: { $in: req.body.deleteImages } } } })
        }
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