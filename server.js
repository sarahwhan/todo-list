const express = require('express');
const path = require('path');

const app = express();

// Use the port from the environment, default to 3000 for local development
const port = process.env.PORT || 3000;

// In-memory task storage
let tasks = [];

// Serve static files (frontend)
app.use(express.static(path.join(__dirname, 'public')));

// Middleware to parse JSON bodies
app.use(express.json());

// API endpoint to get all tasks
app.get('/api/tasks', (req, res) => {
    res.json(tasks);
});

// API endpoint to add a task
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

// Start the server and listen on the dynamic port
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
