document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('taskForm');
    const taskNameInput = document.getElementById('taskName');
    const taskDescriptionInput = document.getElementById('taskDescription');
    const taskDeadlineInput = document.getElementById('taskDeadline');
    const todoList = document.getElementById('todoList');
    const inProgressList = document.getElementById('inProgressList');
    const completedList = document.getElementById('completedList');
    const cardBodies = document.querySelectorAll('.card-body');
    const editTaskForm = document.getElementById('editTaskForm');
    const editTaskNameInput = document.getElementById('editTaskName');
    const editTaskDescriptionInput = document.getElementById('editTaskDescription');
    let currentTaskItem;

    // Load tasks from local storage
    loadTasks();

    taskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const taskName = taskNameInput.value.trim();
        const taskDescription = taskDescriptionInput.value.trim();
        const taskDeadline = taskDeadlineInput.value.trim();

        
        // Check task name should be unique
        if (isTaskNameUnique(taskName)) {
            // Only add the task if it has a name and description
            if (taskName && taskDescription) {
                const taskItem = createTaskElement(taskName, taskDescription, taskDeadline, '');
                todoList.appendChild(taskItem);
                saveTasks();

                // Clearing the input fields
                taskNameInput.value = '';
                taskDescriptionInput.value = '';
                taskDeadlineInput.value = '';

                // Hide the modal after adding the task
                const modal = bootstrap.Modal.getInstance(document.getElementById('taskModal'));
                modal.hide();
                showToast('Task added successfully!');

            }
        } else {
            alert('Task with this name already exists. Please choose a different name.');
        }
    });

    // Function to check if task name is unique
    function isTaskNameUnique(taskName) {
        const allTasks = document.querySelectorAll('.task-item .card-title');
        for (let task of allTasks) {
            if (task.textContent.trim() === taskName) {
                return false;
            }
        }
        return true;
    }
    // Event listeners for drag and drop functionality
    cardBodies.forEach(cardBody => {
        cardBody.addEventListener('dragover', (e) => {
            e.preventDefault();
            const draggingItem = document.querySelector('.is-dragging');
            const afterElement = getDragAfterElement(cardBody, e.clientY);
            if (afterElement == null) {
                cardBody.appendChild(draggingItem);
            } else {
                cardBody.insertBefore(draggingItem, afterElement);
            }
        });

        cardBody.addEventListener('drop', (e) => {
            e.preventDefault();
            const draggingItem = document.querySelector('.is-dragging');
            cardBody.appendChild(draggingItem);

            const currentDate = new Date().toLocaleDateString();
            let statusText = '';

        // Update status text based on the column where the task is dropped
            if (cardBody.id === 'inProgressList') {
                statusText = `In Progress Date: ${currentDate}`;
            } else if (cardBody.id === 'completedList') {
                statusText = `Completed Date: ${currentDate}`;
            }

            const statusElement = draggingItem.querySelector('.status-date');
            if (statusElement) {
                statusElement.textContent = statusText;
            } else {
                const statusDateElem = document.createElement('p');
                statusDateElem.className = 'card-text text-muted status-date';
                statusDateElem.textContent = statusText;
                draggingItem.appendChild(statusDateElem);
            }
            saveTasks();
        });
    });

    // Function to create a new task element
    function createTaskElement(name, description, deadline, status) {
        const taskItem = document.createElement('div');
        taskItem.className = 'task-item mb-2';
        taskItem.setAttribute('draggable', 'true');
    
        const taskBody = document.createElement('div');
        taskBody.className = 'card-body d-flex justify-content-between align-items-start';
    
        const taskContent = document.createElement('div');
        const taskActions = document.createElement('div');
        taskActions.className = 'task-actions';
    
        const taskTitle = document.createElement('h5');
        taskTitle.className = 'card-title';
        taskTitle.textContent = name;
    
        const taskText = document.createElement('p');
        taskText.className = 'card-text';
        taskText.textContent = description;
    
        const taskDeadlineElem = document.createElement('p');
        taskDeadlineElem.className = 'card-text text-muted';
        taskDeadlineElem.textContent = `Deadline: ${deadline}`;
    
        //Edit and Delete icons
        taskActions.innerHTML = `
            <i class="fas fa-edit edit-icon" onclick="editTask(this)"></i>
            <i class="fa-solid fa-calendar-xmark delete-icon" onclick="deleteTask(this)"></i>
        `;
    
        taskContent.appendChild(taskTitle);
        taskContent.appendChild(taskText);
        taskContent.appendChild(taskDeadlineElem);
        taskBody.appendChild(taskContent);
        taskBody.appendChild(taskActions);
        taskItem.appendChild(taskBody);
    
        if (status) {
            const statusDateElem = document.createElement('p');
            statusDateElem.className = 'card-text text-muted status-date';
            statusDateElem.textContent = status;
            taskContent.appendChild(statusDateElem);
        }
    
        taskItem.addEventListener('dragstart', () => {
            taskItem.classList.add('is-dragging');
        });
    
        taskItem.addEventListener('dragend', () => {
            taskItem.classList.remove('is-dragging');
        });
    
        return taskItem;
    }
    
    // Function to open the edit task modal
    window.editTask = function(element) {
        const taskItem = element.closest('.task-item');
        const taskTitle = taskItem.querySelector('.card-title').innerText;
        const taskText = taskItem.querySelector('.card-text').innerText;

        currentTaskItem = taskItem;

        editTaskNameInput.value = taskTitle;
        editTaskDescriptionInput.value = taskText;

        const editModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
        editModal.show();
    }

    //Event listener for editing a task
    editTaskForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const newTaskName = editTaskNameInput.value.trim();
        const newTaskDescription = editTaskDescriptionInput.value.trim();

        if (newTaskName && newTaskDescription) {
            currentTaskItem.querySelector('.card-title').innerText = newTaskName;
            currentTaskItem.querySelector('.card-text').innerText = newTaskDescription;

            const editModal = bootstrap.Modal.getInstance(document.getElementById('editTaskModal'));
            editModal.hide();
            

            saveTasks();
            showToast('Task updated successfully!');

        }
    });

    // Function to delete a task
    window.deleteTask = function(element) {
        if (confirm('Are you sure you want to delete this task?')) {
            const taskItem = element.closest('.task-item');
            taskItem.remove();
            saveTasks();
            showToast('Task deleted successfully!');

        }
    }

    // Save all tasks to local storage
    function saveTasks() {
        const tasks = {
            todo: [],
            inProgress: [],
            completed: []
        };

        document.querySelectorAll('#todoList .task-item').forEach(task => {
            tasks.todo.push(getTaskData(task));
        });

        document.querySelectorAll('#inProgressList .task-item').forEach(task => {
            tasks.inProgress.push(getTaskData(task));
        });

        document.querySelectorAll('#completedList .task-item').forEach(task => {
            tasks.completed.push(getTaskData(task));
        });

        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    // Function to load tasks from local storage and display them
    function loadTasks() {
        const savedTasks = JSON.parse(localStorage.getItem('tasks'));

        if (savedTasks) {
            savedTasks.todo.forEach(task => {
                todoList.appendChild(createTaskElement(task.name, task.description, task.deadline, task.status));
            });
            savedTasks.inProgress.forEach(task => {
                inProgressList.appendChild(createTaskElement(task.name, task.description, task.deadline, task.status));
            });
            savedTasks.completed.forEach(task => {
                completedList.appendChild(createTaskElement(task.name, task.description, task.deadline, task.status));
            });
        }
    }

    // Function to extract task data from a task element
    function getTaskData(taskElement) {
        return {
            name: taskElement.querySelector('.card-title').innerText,
            description: taskElement.querySelector('.card-text').innerText,
            deadline: taskElement.querySelector('.card-text.text-muted').innerText.replace('Deadline: ', ''),
            status: taskElement.querySelector('.status-date') ? taskElement.querySelector('.status-date').textContent : ''
        };
    }

    // Function to determine the position to insert the dragged item
    function getDragAfterElement(container, y) {
        const draggableElements = [...container.querySelectorAll('.task-item:not(.is-dragging)')];

        return draggableElements.reduce((closest, child) => {
            const box = child.getBoundingClientRect();
            const offset = y - box.top - box.height / 2;
            if (offset < 0 && offset > closest.offset) {
                return { offset: offset, element: child };
            } else {
                return closest;
            }
        }, { offset: Number.NEGATIVE_INFINITY }).element;
    }

    function showToast(message) {
        const toastMessage = document.getElementById('toastMessage');
        toastMessage.textContent = message;
        const toast = new bootstrap.Toast(document.getElementById('liveToast'));
        toast.show();
    }
    
});
