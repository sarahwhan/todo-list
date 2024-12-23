document.getElementById('add-task-btn').addEventListener('click', () => {
    const taskInput = document.getElementById('new-task');
    const taskText = taskInput.value.trim();

    if (taskText) {
        const taskList = document.getElementById('task-list');
        const li = document.createElement('li');
        li.textContent = taskText;

        const deleteBtn = document.createElement('button');
        deleteBtn.textContent = 'Delete';
        deleteBtn.addEventListener('click', () => li.remove());

        li.appendChild(deleteBtn);
        taskList.appendChild(li);

        taskInput.value = '';
    }
});
