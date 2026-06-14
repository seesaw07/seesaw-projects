// Todo App JavaScript

let todos = [];
let currentFilter = 'all';

// Load todos from localStorage
function loadTodos() {
    const saved = localStorage.getItem('todos');
    if (saved) {
        todos = JSON.parse(saved);
    }
    renderTodos();
}

// Save todos to localStorage
function saveTodos() {
    localStorage.setItem('todos', JSON.stringify(todos));
    updateStats();
}

// Add new task
function addTask() {
    const input = document.getElementById('task-input');
    const text = input.value.trim();
    
    if (text === '') {
        alert('Please enter a task!');
        return;
    }
    
    const todo = {
        id: Date.now(),
        text: text,
        completed: false
    };
    
    todos.push(todo);
    saveTodos();
    renderTodos();
    input.value = '';
    input.focus();
}

// Toggle task completion
function toggleTask(id) {
    todos = todos.map(todo => {
        if (todo.id === id) {
            return { ...todo, completed: !todo.completed };
        }
        return todo;
    });
    saveTodos();
    renderTodos();
}

// Delete task
function deleteTask(id) {
    todos = todos.filter(todo => todo.id !== id);
    saveTodos();
    renderTodos();
}

// Clear all tasks
function clearAll() {
    if (confirm('Are you sure you want to clear all tasks?')) {
        todos = [];
        saveTodos();
        renderTodos();
    }
}

// Filter tasks
function filterTasks(filter) {
    currentFilter = filter;
    
    // Update active button
    document.querySelectorAll('.filter-btn').forEach(btn => {
        btn.classList.remove('active');
    });
    document.getElementById('filter-' + filter).classList.add('active');
    
    renderTodos();
}

// Update stats
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(t => t.completed).length;
    const pending = total - completed;
    
    document.getElementById('total').textContent = total;
    document.getElementById('completed').textContent = completed;
    document.getElementById('pending').textContent = pending;
}

// Render todos
function renderTodos() {
    const list = document.getElementById('todo-list');
    let filteredTodos = todos;
    
    // Apply filter
    if (currentFilter === 'completed') {
        filteredTodos = todos.filter(t => t.completed);
    } else if (currentFilter === 'pending') {
        filteredTodos = todos.filter(t => !t.completed);
    }
    
    // Empty state
    if (filteredTodos.length === 0) {
        list.innerHTML = `
            <div class="empty-state">
                <span>📝</span>
                <p>No tasks found!</p>
            </div>
        `;
        updateStats();
        return;
    }
    
    // Render tasks
    list.innerHTML = filteredTodos.map(todo => `
        <li class="todo-item ${todo.completed ? 'completed' : ''}">
            <div class="checkbox ${todo.completed ? 'checked' : ''}" 
                 onclick="toggleTask(${todo.id})"></div>
            <span class="task-text">${todo.text}</span>
            <button class="delete-btn" onclick="deleteTask(${todo.id})">🗑️</button>
        </li>
    `).join('');
    
    updateStats();
}

// Allow Enter key to add task
document.addEventListener('keypress', function(e) {
    if (e.key === 'Enter') {
        addTask();
    }
});

// Load todos when page loads
loadTodos();