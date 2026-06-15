const express = require('express');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(express.json());

// In-memory storage
let notes = [];
let idCounter = 1;

// Get all notes
app.get('/api/notes', (req, res) => {
    res.json({ success: true, data: notes.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) });
});

// Create note
app.post('/api/notes', (req, res) => {
    const { title, content, category } = req.body;
    
    if (!title || !content) {
        return res.status(400).json({ success: false, error: 'Title and content required' });
    }

    const note = {
        _id: idCounter++,
        title,
        content,
        category: category || 'general',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };

    notes.push(note);
    res.status(201).json({ success: true, data: note });
});

// Update note
app.put('/api/notes/:id', (req, res) => {
    const { title, content, category } = req.body;
    const id = parseInt(req.params.id);
    
    const index = notes.findIndex(n => n._id === id);
    
    if (index === -1) {
        return res.status(404).json({ success: false, error: 'Note not found' });
    }

    notes[index] = {
        ...notes[index],
        title,
        content,
        category,
        updatedAt: new Date().toISOString()
    };

    res.json({ success: true, data: notes[index] });
});

// Delete note
app.delete('/api/notes/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const index = notes.findIndex(n => n._id === id);
    
    if (index === -1) {
        return res.status(404).json({ success: false, error: 'Note not found' });
    }

    notes.splice(index, 1);
    res.json({ success: true, message: 'Note deleted' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Backend running on http://localhost:${PORT}`);
});