import React, { useState, useEffect } from 'react';

function App() {
    // State for todos - load from localStorage on start
    const [todos, setTodos] = useState(() => {
        try {
            const saved = localStorage.getItem('react-todos-v2');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });
    
    const [inputValue, setInputValue] = useState('');
    const [filter, setFilter] = useState('all');
    const [priority, setPriority] = useState('medium');
    const [category, setCategory] = useState('personal');
    const [searchQuery, setSearchQuery] = useState('');
    const [editingId, setEditingId] = useState(null);
    const [editValue, setEditValue] = useState('');
    const [dueDate, setDueDate] = useState('');

    // Save todos to localStorage whenever todos change
    useEffect(() => {
        try {
            localStorage.setItem('react-todos-v2', JSON.stringify(todos));
        } catch (error) {
            console.log('Error saving to localStorage:', error);
        }
    }, [todos]);

    // Add new todo
    const addTodo = () => {
        if (inputValue.trim() === '') return;

        const newTodo = {
            id: Date.now(),
            text: inputValue.trim(),
            completed: false,
            priority: priority,
            category: category,
            dueDate: dueDate || null,
            createdAt: new Date().toISOString()
        };

        setTodos([newTodo, ...todos]);
        setInputValue('');
        setDueDate('');
    };

    // Toggle todo completion
    const toggleTodo = (id) => {
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, completed: !todo.completed } : todo
        ));
    };

    // Delete todo
    const deleteTodo = (id) => {
        if (window.confirm('Delete this task?')) {
            setTodos(todos.filter(todo => todo.id !== id));
        }
    };

    // Start editing
    const startEdit = (todo) => {
        setEditingId(todo.id);
        setEditValue(todo.text);
    };

    // Save edit
    const saveEdit = (id) => {
        if (editValue.trim() === '') return;
        
        setTodos(todos.map(todo =>
            todo.id === id ? { ...todo, text: editValue.trim() } : todo
        ));
        setEditingId(null);
        setEditValue('');
    };

    // Cancel edit
    const cancelEdit = () => {
        setEditingId(null);
        setEditValue('');
    };

    // Clear completed todos
    const clearCompleted = () => {
        if (window.confirm('Clear all completed tasks?')) {
            setTodos(todos.filter(todo => !todo.completed));
        }
    };

    // Handle Enter key for add
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            addTodo();
        }
    };

    // Handle Enter key for edit
    const handleEditKeyPress = (e, id) => {
        if (e.key === 'Enter') {
            saveEdit(id);
        }
        if (e.key === 'Escape') {
            cancelEdit();
        }
    };

    // Filter and search todos
    const filteredTodos = todos.filter(todo => {
        // Filter by status
        if (filter === 'active' && todo.completed) return false;
        if (filter === 'completed' && !todo.completed) return false;
        
        // Filter by search query
        if (searchQuery && !todo.text.toLowerCase().includes(searchQuery.toLowerCase())) {
            return false;
        }
        
        return true;
    });

    // Sort by priority
    const sortedTodos = [...filteredTodos].sort((a, b) => {
        const priorityOrder = { high: 0, medium: 1, low: 2 };
        return priorityOrder[a.priority] - priorityOrder[b.priority];
    });

    // Stats
    const totalTodos = todos.length;
    const completedTodos = todos.filter(t => t.completed).length;
    const activeTodos = totalTodos - completedTodos;
    const highPriorityTodos = todos.filter(t => t.priority === 'high' && !t.completed).length;

    // Get priority color
    const getPriorityColor = (p) => {
        switch(p) {
            case 'high': return '#ef4444';
            case 'medium': return '#f59e0b';
            case 'low': return '#22c55e';
            default: return '#6366f1';
        }
    };

    // Get category icon
    const getCategoryIcon = (cat) => {
        switch(cat) {
            case 'personal': return '👤';
            case 'work': return '💼';
            case 'shopping': return '🛒';
            case 'health': return '💪';
            case 'learning': return '📚';
            default: return '📌';
        }
    };

    // Check if overdue
    const isOverdue = (dueDate) => {
        if (!dueDate) return false;
        return new Date(dueDate) < new Date();
    };

    // Format date
    const formatDate = (dateStr) => {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    return (
        <div className="app">
            <div className="container">
                {/* Header */}
                <header className="header">
                    <h1>📝 Task Manager</h1>
                    <p>Built with React.js | Pro Version</p>
                </header>

                {/* Stats */}
                <div className="stats">
                    <div className="stat">
                        <span className="stat-number">{totalTodos}</span>
                        <span className="stat-label">Total</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">{activeTodos}</span>
                        <span className="stat-label">Active</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number">{completedTodos}</span>
                        <span className="stat-label">Done</span>
                    </div>
                    <div className="stat">
                        <span className="stat-number" style={{ color: '#ef4444' }}>{highPriorityTodos}</span>
                        <span className="stat-label">Urgent</span>
                    </div>
                </div>

                {/* Search */}
                <div className="search-section">
                    <input
                        type="text"
                        className="search-input"
                        placeholder="🔍 Search tasks..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Input Section */}
                <div className="input-section">
                    <input
                        type="text"
                        placeholder="Add a new task..."
                        value={inputValue}
                        onChange={(e) => setInputValue(e.target.value)}
                        onKeyPress={handleKeyPress}
                    />
                    <button className="add-btn" onClick={addTodo}>
                        Add
                    </button>
                </div>

                {/* Options Row */}
                <div className="options-row">
                    <div className="option-group">
                        <label>Priority:</label>
                        <select value={priority} onChange={(e) => setPriority(e.target.value)} className="priority-select">
                            <option value="high">🔴 High</option>
                            <option value="medium">🟡 Medium</option>
                            <option value="low">🟢 Low</option>
                        </select>
                    </div>
                    <div className="option-group">
                        <label>Category:</label>
                        <select value={category} onChange={(e) => setCategory(e.target.value)} className="category-select">
                            <option value="personal">👤 Personal</option>
                            <option value="work">💼 Work</option>
                            <option value="shopping">🛒 Shopping</option>
                            <option value="health">💪 Health</option>
                            <option value="learning">📚 Learning</option>
                        </select>
                    </div>
                    <div className="option-group">
                        <label>Due:</label>
                        <input 
                            type="date" 
                            value={dueDate} 
                            onChange={(e) => setDueDate(e.target.value)}
                            className="date-input"
                        />
                    </div>
                </div>

                {/* Filter Buttons */}
                <div className="filters">
                    <button
                        className={`filter-btn ${filter === 'all' ? 'active' : ''}`}
                        onClick={() => setFilter('all')}
                    >
                        All ({totalTodos})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'active' ? 'active' : ''}`}
                        onClick={() => setFilter('active')}
                    >
                        Active ({activeTodos})
                    </button>
                    <button
                        className={`filter-btn ${filter === 'completed' ? 'active' : ''}`}
                        onClick={() => setFilter('completed')}
                    >
                        Completed ({completedTodos})
                    </button>
                </div>

                {/* Todo List */}
                <div className="todo-list">
                    {sortedTodos.length === 0 ? (
                        <div className="empty-state">
                            <p style={{ fontSize: '3rem' }}>📋</p>
                            <p>{searchQuery ? 'No matching tasks!' : 'No tasks yet!'}</p>
                        </div>
                    ) : (
                        sortedTodos.map(todo => (
                            <div
                                key={todo.id}
                                className={`todo-item ${todo.completed ? 'completed' : ''} ${isOverdue(todo.dueDate) ? 'overdue' : ''}`}
                                style={{ borderLeft: `4px solid ${getPriorityColor(todo.priority)}` }}
                            >
                                <div
                                    className={`checkbox ${todo.completed ? 'checked' : ''}`}
                                    onClick={() => toggleTodo(todo.id)}
                                ></div>
                                
                                <div className="todo-content">
                                    {editingId === todo.id ? (
                                        <div className="edit-mode">
                                            <input
                                                type="text"
                                                className="edit-input"
                                                value={editValue}
                                                onChange={(e) => setEditValue(e.target.value)}
                                                onKeyDown={(e) => handleEditKeyPress(e, todo.id)}
                                                autoFocus
                                            />
                                            <button className="edit-save" onClick={() => saveEdit(todo.id)}>✓</button>
                                            <button className="edit-cancel" onClick={cancelEdit}>✕</button>
                                        </div>
                                    ) : (
                                        <>
                                            <span className="todo-text">{todo.text}</span>
                                            <div className="todo-meta">
                                                <span className="category-tag">{getCategoryIcon(todo.category)} {todo.category}</span>
                                                {todo.dueDate && (
                                                    <span className={`due-date ${isOverdue(todo.dueDate) ? 'overdue-text' : ''}`}>
                                                        📅 {formatDate(todo.dueDate)}
                                                    </span>
                                                )}
                                            </div>
                                        </>
                                    )}
                                </div>

                                {editingId !== todo.id && (
                                    <div className="todo-actions">
                                        <button
                                            className="action-btn edit"
                                            onClick={() => startEdit(todo)}
                                            title="Edit"
                                        >
                                            ✏️
                                        </button>
                                        <button
                                            className="action-btn delete"
                                            onClick={() => deleteTodo(todo.id)}
                                            title="Delete"
                                        >
                                            🗑️
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>

                {/* Clear Completed */}
                {completedTodos > 0 && (
                    <div className="clear-section">
                        <button className="clear-btn" onClick={clearCompleted}>
                            Clear Completed ({completedTodos})
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;