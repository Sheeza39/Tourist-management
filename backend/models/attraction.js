const mongoose = require('mongoose');

const attractionSchema = new mongoose.Schema({
    name: { type: String, required: true },
    location: { type: String, required: true },
    entryFee: { type: Number, required: true, min: 0 },  // Entry fee cannot be negative
    rating: { type: Number, default: 0, min: 0, max: 5 } // Rating between 0 to 5
});

module.exports = mongoose.model('Attraction', attractionSchema);
