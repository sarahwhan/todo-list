const apiUrl = 'https://todolist-sarah.netlify.app/';

async function loadTasks() {
    const response = await fetch(apiUrl);
    const tasks = await response.json();
    const taskList = document.getElementById('task-list');
    taskList.innerHTML = '';

    tasks.forEach((task, index) => {
        const li = document.createElement('li');
        li.textContent = task;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', async () => {
            await fetch(`${apiUrl}/${index}`, { method: 'DELETE' });
            loadTasks();
        });

        li.appendChild(deleteBtn);
        taskList.appendChild(li);
    });
}

document.getElementById('add-task-btn').addEventListener('click', async () => {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();

    if (taskText) {
        await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ task: taskText })
        });
        taskInput.value = '';
        loadTasks();
    }
});

loadTasks();
