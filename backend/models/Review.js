const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
    attraction: { type: mongoose.Schema.Types.ObjectId, ref: 'Attraction', required: true },
    visitor: { type: mongoose.Schema.Types.ObjectId, ref: 'Visitor', required: true },
    score: { type: Number, required: true, min: 1, max: 5 }, // Score between 1 and 5
    comment: { type: String } // Optional comment
});

module.exports = mongoose.model('Review', reviewSchema);
