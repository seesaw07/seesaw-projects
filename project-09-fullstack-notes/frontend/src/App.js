import React, { useState, useEffect } from 'react';

const API_URL = 'https://backend-ten-alpha-12.vercel.app';

function App() {
    const [notes, setNotes] = useState([]);
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [category, setCategory] = useState('general');
    const [editingId, setEditingId] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        fetchNotes();
    }, []);

    const fetchNotes = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${API_URL}/notes`);
            const data = await response.json();
            if (data.success) {
                setNotes(data.data);
            }
        } catch (err) {
            setError('Failed to fetch notes');
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!title.trim() || !content.trim()) {
            setError('Title and content required');
            return;
        }

        try {
            if (editingId) {
                await fetch(`${API_URL}/notes/${editingId}`, {
                    method: 'PUT',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, content, category })
                });
            } else {
                await fetch(`${API_URL}/notes`, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ title, content, category })
                });
            }

            setTitle('');
            setContent('');
            setCategory('general');
            setEditingId(null);
            fetchNotes();
        } catch (err) {
            setError('Failed to save note');
        }
    };

    const handleEdit = (note) => {
        setEditingId(note._id);
        setTitle(note.title);
        setContent(note.content);
        setCategory(note.category);
    };

    const handleDelete = async (id) => {
        if (!window.confirm('Delete this note?')) return;
        try {
            await fetch(`${API_URL}/notes/${id}`, { method: 'DELETE' });
            fetchNotes();
        } catch (err) {
            setError('Failed to delete note');
        }
    };

    const handleCancel = () => {
        setEditingId(null);
        setTitle('');
        setContent('');
        setCategory('general');
    };

    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="app">
                <div className="container">
                    <div className="loading">
                        <div className="spinner"></div>
                        <p>Loading...</p>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="app">
            <div className="container">
                <header className="header">
                    <h1>📝 Full-Stack Notes</h1>
                    <p>React + Node.js</p>
                </header>

                <div className="stats">
                    <div className="stat">
                        <span className="stat-number">{notes.length}</span>
                        <span className="stat-label">Total Notes</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">{notes.filter(n => n.category === 'work').length}</span>
                        <span className="stat-label">Work</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">{notes.filter(n => n.category === 'personal').length}</span>
                        <span className="stat-label">Personal</span>
                    </div>
                </div>

                {error && <div className="error-message">⚠️ {error}</div>}

                <div className="form-section">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2>{editingId ? '✏️ Edit Note' : '➕ New Note'}</h2>
                        {editingId && (
                            <button className="btn btn-secondary" onClick={handleCancel}>
                                Cancel
                            </button>
                        )}
                    </div>
                    
                    <form onSubmit={handleSubmit}>
                        <div className="form-row">
                            <div className="form-group">
                                <label>Title</label>
                                <input
                                    type="text"
                                    placeholder="Note title..."
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                />
                            </div>
                            <div className="form-group">
                                <label>Category</label>
                                <select value={category} onChange={(e) => setCategory(e.target.value)}>
                                    <option value="general">📌 General</option>
                                    <option value="work">💼 Work</option>
                                    <option value="personal">👤 Personal</option>
                                    <option value="ideas">💡 Ideas</option>
                                    <option value="tasks">✅ Tasks</option>
                                </select>
                            </div>
                        </div>
                        <div className="form-row">
                            <div className="form-group full">
                                <label>Content</label>
                                <textarea
                                    placeholder="Write your note here..."
                                    value={content}
                                    onChange={(e) => setContent(e.target.value)}
                                ></textarea>
                            </div>
                        </div>
                        <button type="submit" className="btn btn-primary">
                            {editingId ? '💾 Update Note' : '➕ Add Note'}
                        </button>
                    </form>
                </div>

                {notes.length === 0 ? (
                    <div className="empty-state">
                        <p style={{ fontSize: '3rem' }}>📝</p>
                        <p>No notes yet! Create your first note above.</p>
                    </div>
                ) : (
                    <div className="notes-grid">
                        {notes.map(note => (
                            <div key={note._id} className="note-card">
                                <div className="note-header">
                                    <span className="note-category">📌 {note.category}</span>
                                    <div className="note-actions">
                                        <button className="note-action-btn" onClick={() => handleEdit(note)}>✏️</button>
                                        <button className="note-action-btn delete" onClick={() => handleDelete(note._id)}>🗑️</button>
                                    </div>
                                </div>
                                <h3 className="note-title">{note.title}</h3>
                                <p className="note-content">{note.content}</p>
                                <div className="note-footer">
                                    <span className="note-date">📅 {formatDate(note.createdAt)}</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;