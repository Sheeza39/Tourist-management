const mongoose = require('mongoose');

const visitorSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true, match: /\S+@\S+\.\S+/ }, // Email must be valid
    visitedAttractions: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Attraction' }] // List of visited attractions
});

module.exports = mongoose.model('Visitor', visitorSchema);
