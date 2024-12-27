const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const bodyParser = require('body-parser');
const Attraction = require('./models/attraction');
const Visitor = require('./models/visitor');
const Review = require('./models/Review');

const app = express();
app.use(bodyParser.json());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.use(express.static(path.join(__dirname, '../public')));

// Connect to MongoDB
mongoose.connect('mongodb+srv://sheeza:sheeza1234@cluster0.iz15y.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("Connected to MongoDB"))
    .catch(err => console.log("Error connecting to MongoDB:", err));

// Routes for Attractions

// Create a new Attraction
app.post('/attractions', async (req, res) => {
    const { name, location, entryFee } = req.body;
    if (entryFee < 0) {
        return res.status(400).json({ message: 'Entry fee cannot be negative' });
    }
    const newAttraction = new Attraction({ name, location, entryFee });
    await newAttraction.save();
    res.status(201).json(newAttraction);
});

// Get all Attractions
app.get('/attractions', async (req, res) => {
    const attractions = await Attraction.find();
    res.render('attractions', { attractions });
});

// Get Top-rated Attractions
app.get('/attractions/top-rated', async (req, res) => {
    const topRatedAttractions = await Attraction.find().sort({ rating: -1 }).limit(5);
    res.render('topRated', { topRatedAttractions });
});

// Routes for Visitors

// Register a new Visitor
app.post('/visitors', async (req, res) => {
    const { name, email } = req.body;
    const existingVisitor = await Visitor.findOne({ email });
    if (existingVisitor) {
        return res.status(400).json({ message: 'Email already exists.' });
    }
    const newVisitor = new Visitor({ name, email });
    await newVisitor.save();
    res.status(201).json(newVisitor);
});

// Get all Visitors
app.get('/visitors', async (req, res) => {
    const visitors = await Visitor.find();
    res.render('visitors', { visitors });
});

// Get Visitor Activity (List of visitors with reviewed attractions count)
app.get('/visitors/activity', async (req, res) => {
    const visitors = await Visitor.aggregate([
        { $lookup: { from: 'reviews', localField: '_id', foreignField: 'visitor', as: 'reviews' }},
        { $project: { name: 1, email: 1, reviewCount: { $size: '$reviews' }}}
    ]);
    res.render('visitorActivity', { visitors });
});

// Routes for Reviews

// Post a Review for an Attraction
app.post('/reviews', async (req, res) => {
    const { attraction, visitor, score, comment } = req.body;
    
    // Ensure Visitor has visited the Attraction
    const visitorData = await Visitor.findById(visitor);
    if (!visitorData || !visitorData.visitedAttractions.includes(attraction)) {
        return res.status(400).json({ message: 'Visitor must have visited the attraction before posting a review.' });
    }

    // Ensure Visitor hasn't already reviewed the Attraction
    const existingReview = await Review.findOne({ attraction, visitor });
    if (existingReview) {
        return res.status(400).json({ message: 'Visitor has already reviewed this attraction.' });
    }

    // Create Review
    const newReview = new Review({ attraction, visitor, score, comment });
    await newReview.save();

    // Update Attraction Rating
    const reviews = await Review.find({ attraction });
    const averageRating = reviews.reduce((sum, review) => sum + review.score, 0) / reviews.length;

    await Attraction.findByIdAndUpdate(attraction, { rating: averageRating });
    res.status(201).json(newReview);
});

// Start the Server
app.listen(3000, () => {
    console.log('Server running on http://localhost:3000');
});
