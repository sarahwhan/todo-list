const apiUrl = 'https://todo-list-2fgq.onrender.com/api/tasks';  // Backend API URL

// Function to load tasks from the backend API
async function loadTasks() {
    const response = await fetch(apiUrl);
    const tasks = await response.json();

    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        
        // Checkbox for marking task as complete
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed || false;
        checkbox.addEventListener('change', () => toggleTaskComplete(index, checkbox.checked));
        li.appendChild(checkbox);

        // Task text
        const taskText = document.createElement('span');
        taskText.textContent = task.task;
        if (task.completed) taskText.classList.add('completed'); // Add 'completed' class if task is marked
        li.appendChild(taskText);

        // Delete button to remove task
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteTask(index));
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });
}

// Function to add a new task
async function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();

    if (!taskText) return;

    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: taskText, completed: false }), // Add new task as incomplete
    });

    taskInput.value = '';
    loadTasks();
}

// Function to toggle task completion status
async function toggleTaskComplete(index, completed) {
    await fetch(`${apiUrl}/${index}`, {
        method: 'PUT', // Use PUT to update the task
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ completed }), // Update completion status
    });
    loadTasks();
}

// Function to delete a task by index
async function deleteTask(index) {
    await fetch(`${apiUrl}/${index}`, {
        method: 'DELETE',
    });
    loadTasks();
}

// Add event listener for adding task when button is clicked
document.getElementById('add-task-btn').addEventListener('click', addTask);

// Load tasks when the page is first loaded
loadTasks();
