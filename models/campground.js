const mongoose = require('mongoose')
const Review = require('./reviewSchema');
const User =  require('./user');

const Schema = mongoose.Schema;

const ImageSchema = new Schema({
    url: String,
    filename: String
});

ImageSchema.virtual('thumbnail').get(function () {
    return this.url.replace('/upload', '/upload/w_200');
});

const CampgroundSchema = new Schema({
    title : String,
    longitude: Number, 
    latitude: Number,
    image: [ImageSchema],
    description : String,
    location : String,
    reviews : [
        {
            type : Schema.Types.ObjectId,
            ref : 'Review'
        }
    ],
    author : {
        type : Schema.Types.ObjectId,
        ref : 'User'
    }
});

CampgroundSchema.post('findOneAndDelete', async (doc) => {
    if(doc){
        await Review.deleteMany({
            _id : {
                $in : doc.reviews
            }
        })
    }
})

module.exports = mongoose.model('Campground', CampgroundSchema);