const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ReviewSchema = new Schema({
    body: String,
    rating: Number,
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User'
    },
    posted: {
        type: Date,
        default: Date.now,
        require: true,
    }
});

module.exports = mongoose.model('Review', ReviewSchema);