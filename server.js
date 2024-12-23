const express = require('express');
const path = require('path');

const app = express();
const port = process.env.PORT || 10000;

// In-memory task storage (replace with a database for production)
let tasks = [];

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public'))); // Serve frontend files from the 'public' directory

// Middleware to parse JSON bodies
app.use(express.json());

// API endpoint to get all tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// API endpoint to add a new task
app.post('/api/tasks', (req, res) => {
    const { task } = req.body;
    if (task) {
        tasks.push(task);
        res.status(201).json({ message: 'Task added!', tasks });
    } else {
        res.status(400).json({ message: 'Task content required' });
    }
});

// API endpoint to delete a task by index
app.delete('/api/tasks/:index', (req, res) => {
    const index = parseInt(req.params.index, 10);
    if (index >= 0 && index < tasks.length) {
        tasks.splice(index, 1);
        res.json({ message: 'Task deleted!', tasks });
    } else {
        res.status(404).json({ message: 'Task not found' });
    }
});

// Catch-all route to serve the frontend index.html for non-API requests
app.get('*', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
