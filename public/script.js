// Define the base API URL
const apiUrl = '/api'; // Use the relative path for production (Render will handle it)

// You can change this if you're testing locally
// const apiUrl = 'http://localhost:3000/api'; // Uncomment for local testing

const taskInput = document.getElementById('new-task');
const taskList = document.getElementById('task-list');
const addTaskBtn = document.getElementById('add-task-btn');

// Function to load tasks from the backend and display them
async function loadTasks() {
    const response = await fetch(`${apiUrl}/tasks`);  // Fetch tasks from the backend
    const tasks = await response.json();  // Parse the response to JSON

    taskList.innerHTML = '';  // Clear any existing tasks in the list

    // Loop through each task and create list items for them
    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task;

        // Create a delete button for each task
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => deleteTask(index));  // Link delete function

        li.appendChild(deleteBtn);  // Append the delete button to the list item
        taskList.appendChild(li);  // Append the list item to the task list
    });
}

// Function to add a new task
async function addTask() {
    const taskText = taskInput.value.trim();
    if (!taskText) return;  // If the task input is empty, do nothing

    await fetch(`${apiUrl}/tasks`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: taskText })  // Send the task content to the backend
    });

    taskInput.value = '';  // Clear the task input field
    loadTasks();  // Reload the tasks to reflect the new addition
}

// Function to delete a task
async function deleteTask(index) {
    await fetch(`${apiUrl}/tasks/${index}`, {
        method: 'DELETE'  // Send a DELETE request to remove the task
    });
    loadTasks();  // Reload tasks after deletion to reflect changes
}

// Event listener for adding a new task when the button is clicked
addTaskBtn.addEventListener('click', addTask);

// Call the loadTasks function to display tasks when the page loads
loadTasks();
