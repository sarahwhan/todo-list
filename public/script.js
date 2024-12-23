const apiUrl = 'https://todo-list-2fgq.onrender.com/api/tasks';  // Backend API URL

async function loadTasks() {
    const response = await fetch(apiUrl);
    const tasks = await response.json();

    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');

        const taskText = document.createElement('span');
        taskText.textContent = task;
        li.appendChild(taskText);

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = '🗑️';
        deleteBtn.className = 'delete-btn';
        deleteBtn.addEventListener('click', () => deleteTask(index));
        li.appendChild(deleteBtn);

        taskList.appendChild(li);
    });
}

async function addTask() {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();

    if (!taskText) return;

    await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ task: taskText }),
    });

    taskInput.value = '';
    loadTasks();
}

async function deleteTask(index) {
    await fetch(`${apiUrl}/${index}`, {
        method: 'DELETE',
    });
    loadTasks();
}

document.getElementById('add-task-btn').addEventListener('click', addTask);

loadTasks();
