const mongoose = require('mongoose');
const { Schema } = mongoose;

const ReviewSchema = new Schema({
    Rating : Number,
    Review : String,
    author : {
        type : mongoose.Schema.Types.ObjectId,
        ref : 'User'
    }
})

module.exports = mongoose.model('Review', ReviewSchema);

