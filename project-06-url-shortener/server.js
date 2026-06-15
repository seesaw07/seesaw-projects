// URL Shortener Backend

const express = require('express');
const mongoose = require('mongoose');
const shortid = require('shortid');
require('dotenv').config();

const app = express();

// Middleware
app.use(express.json());
app.use(express.static('public'));

// In-memory storage (backup if MongoDB fails)
let urlStorage = [];
let idCounter = 1;

// Try to connect to MongoDB
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/urlshortener';

mongoose.connect(MONGO_URI)
    .then(() => {
        console.log('MongoDB Connected');
    })
    .catch(err => {
        console.log('MongoDB not available, using in-memory storage');
    });

// Check if MongoDB is connected
function isMongoConnected() {
    return mongoose.connection.readyState === 1;
}

// URL Schema (for MongoDB)
const urlSchema = new mongoose.Schema({
    originalUrl: { type: String, required: true },
    shortCode: { type: String, required: true, unique: true },
    clicks: { type: Number, default: 0 },
    createdAt: { type: Date, default: Date.now }
});

const Url = mongoose.model('Url', urlSchema);

// API Routes

// Create short URL
app.post('/api/shorten', async (req, res) => {
    try {
        const { originalUrl } = req.body;
        
        if (!originalUrl) {
            return res.status(400).json({ error: 'URL is required' });
        }

        if (isMongoConnected()) {
            // Use MongoDB
            let url = await Url.findOne({ originalUrl });
            if (url) {
                return res.json({
                    originalUrl: url.originalUrl,
                    shortCode: url.shortCode,
                    shortUrl: `http://localhost:${process.env.PORT || 3000}/${url.shortCode}`,
                    clicks: url.clicks
                });
            }

            const shortCode = shortid.generate();
            url = new Url({ originalUrl, shortCode });
            await url.save();

            res.json({
                originalUrl: url.originalUrl,
                shortCode: url.shortCode,
                shortUrl: `http://localhost:${process.env.PORT || 3000}/${shortCode}`,
                clicks: url.clicks
            });

        } else {
            // Use in-memory storage
            let existing = urlStorage.find(u => u.originalUrl === originalUrl);
            if (existing) {
                return res.json({
                    originalUrl: existing.originalUrl,
                    shortCode: existing.shortCode,
                    shortUrl: `http://localhost:${process.env.PORT || 3000}/${existing.shortCode}`,
                    clicks: existing.clicks
                });
            }

            const shortCode = shortid.generate();
            const newUrl = {
                id: idCounter++,
                originalUrl,
                shortCode,
                clicks: 0,
                createdAt: new Date()
            };
            urlStorage.push(newUrl);

            res.json({
                originalUrl: newUrl.originalUrl,
                shortCode: newUrl.shortCode,
                shortUrl: `http://localhost:${process.env.PORT || 3000}/${shortCode}`,
                clicks: newUrl.clicks
            });
        }

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Redirect to original URL
app.get('/:shortCode', async (req, res) => {
    try {
        if (isMongoConnected()) {
            const url = await Url.findOne({ shortCode: req.params.shortCode });
            if (!url) {
                return res.status(404).json({ error: 'URL not found' });
            }
            url.clicks += 1;
            await url.save();
            res.redirect(url.originalUrl);
        } else {
            const url = urlStorage.find(u => u.shortCode === req.params.shortCode);
            if (!url) {
                return res.status(404).json({ error: 'URL not found' });
            }
            url.clicks += 1;
            res.redirect(url.originalUrl);
        }

    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Get all URLs
app.get('/api/urls', async (req, res) => {
    try {
        if (isMongoConnected()) {
            const urls = await Url.find().sort({ createdAt: -1 });
            res.json(urls);
        } else {
            res.json(urlStorage.sort((a, b) => b.createdAt - a.createdAt));
        }
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Delete URL
app.delete('/api/urls/:id', async (req, res) => {
    try {
        if (isMongoConnected()) {
            await Url.findByIdAndDelete(req.params.id);
        } else {
            urlStorage = urlStorage.filter(u => u.id != req.params.id);
        }
        res.json({ message: 'URL deleted' });
    } catch (error) {
        res.status(500).json({ error: 'Server error' });
    }
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});