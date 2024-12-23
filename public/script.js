const apiUrl = 'https://todo-list-2fgq.onrender.com/api/tasks';  // Backend API URL

// Function to load tasks from the backend API
async function loadTasks() {
    const response = await fetch(apiUrl);
    const tasks = await response.json();

    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        
        // Create the task control container (for task text and delete button)
        const taskControls = document.createElement('div');
        taskControls.className = 'task-controls';

        // Checkbox for marking task as complete
        const checkbox = document.createElement('input');
        checkbox.type = 'checkbox';
        checkbox.className = 'task-checkbox';
        checkbox.checked = task.completed || false;
        checkbox.addEventListener('change', () => toggleTaskComplete(index, checkbox.checked));
        taskControls.appendChild(checkbox);

        // Task text
        const taskText = document.createElement('span');
        taskText.textContent = task.task;
        if (task.completed) taskText.classList.add('completed'); // Add 'completed' class if task is marked
        taskControls.appendChild(taskText);

        // Delete button to remove task
        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();  // Prevent expanding when deleting
            deleteTask(index);
        });
        taskControls.appendChild(deleteBtn);

        li.appendChild(taskControls);

        // Expand the task when clicked
        li.addEventListener('click', () => expandTask(index, li));

        taskList.appendChild(li);
    });
}

// Function to expand a task and show Pomodoro timer
function expandTask(index, li) {
    // Check if task is already expanded
    if (li.querySelector('.expanded-task')) {
        li.querySelector('.expanded-task').remove();
    } else {
        const expandedBox = document.createElement('div');
        expandedBox.className = 'expanded-task';

        // Timer input field
        const timerInput = document.createElement('input');
        timerInput.id = 'timer-input';
        timerInput.type = 'number';
        timerInput.placeholder = 'Enter time in minutes';
        expandedBox.appendChild(timerInput);

        // Start Pomodoro button (corrected ID)
        const startBtn = document.createElement('button');
        startBtn.id = 'start-pomodoro-btn';  // Corrected ID here
        startBtn.textContent = 'Start Pomodoro Timer';
        startBtn.addEventListener('click', (e) => e.stopPropagation());
        startBtn.addEventListener('click', () => startPomodoroTimer(timerInput.value, expandedBox));
        expandedBox.appendChild(startBtn);

        // Timer display
        const timerDisplay = document.createElement('div');
        timerDisplay.id = 'pomodoro-timer';
        expandedBox.appendChild(timerDisplay);

        // Prevent task collapse when clicking on the input field
        timerInput.addEventListener('click', (e) => e.stopPropagation());

        li.appendChild(expandedBox);
    }
}

// Function to start the Pomodoro timer
function startPomodoroTimer(minutes, expandedBox) {
    if (!minutes || minutes <= 0) {
        alert('Please enter a valid time.');
        return;
    }

    let timeRemaining = minutes * 60;
    const timerDisplay = expandedBox.querySelector('#pomodoro-timer');

    const interval = setInterval(() => {
        const minutesLeft = Math.floor(timeRemaining / 60);
        const secondsLeft = timeRemaining % 60;

        timerDisplay.textContent = `${minutesLeft}:${secondsLeft.toString().padStart(2, '0')}`;

        if (timeRemaining <= 0) {
            clearInterval(interval);
            alert('Pomodoro session completed!');
        }

        timeRemaining--;
    }, 1000);
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
