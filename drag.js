// document.addEventListener('DOMContentLoaded', () => {
//     const cardBodies = document.querySelectorAll('.card-body');

//     // Event listeners for drag and drop functionality
//     cardBodies.forEach(cardBody => {
//         cardBody.addEventListener('dragover', (e) => {
//             e.preventDefault();
//             const draggingItem = document.querySelector('.is-dragging');
//             const afterElement = getDragAfterElement(cardBody, e.clientY);
//             if (afterElement == null) {
//                 cardBody.appendChild(draggingItem);
//             } else {
//                 cardBody.insertBefore(draggingItem, afterElement);
//             }
//         });

//         cardBody.addEventListener('drop', (e) => {
//             e.preventDefault();
//             const draggingItem = document.querySelector('.is-dragging');
//             cardBody.appendChild(draggingItem);

//             const currentDate = new Date().toLocaleDateString();
//             let statusText = '';

//             if (cardBody.id === 'inProgressList') {
//                 statusText = `In Progress Date: ${currentDate}`;
//             } else if (cardBody.id === 'completedList') {
//                 statusText = `Completed Date: ${currentDate}`;
//             }

//             const statusElement = draggingItem.querySelector('.status-date');
//             if (statusElement) {
//                 statusElement.textContent = statusText;
//             } else {
//                 const statusDateElem = document.createElement('p');
//                 statusDateElem.className = 'card-text text-muted status-date';
//                 statusDateElem.textContent = statusText;
//                 draggingItem.appendChild(statusDateElem);
//             }
//             saveTasks();
//         });
//     });

//     // Function to determine where to place the dragged item
//     function getDragAfterElement(container, y) {
//         const draggableElements = [...container.querySelectorAll('.task-item:not(.is-dragging)')];

//         return draggableElements.reduce((closest, child) => {
//             const box = child.getBoundingClientRect();
//             const offset = y - box.top - box.height / 2;
//             if (offset < 0 && offset > closest.offset) {
//                 return { offset: offset, element: child };
//             } else {
//                 return closest;
//             }
//         }, { offset: Number.NEGATIVE_INFINITY }).element;
//     }

//     function saveTasks() {
//         const tasks = {
//             todo: [],
//             inProgress: [],
//             completed: []
//         };

//         document.querySelectorAll('#todoList .task-item').forEach(task => {
//             tasks.todo.push(getTaskData(task));
//         });

//         document.querySelectorAll('#inProgressList .task-item').forEach(task => {
//             tasks.inProgress.push(getTaskData(task));
//         });

//         document.querySelectorAll('#completedList .task-item').forEach(task => {
//             tasks.completed.push(getTaskData(task));
//         });

//         localStorage.setItem('tasks', JSON.stringify(tasks));
//     }

//     function getTaskData(taskElement) {
//         return {
//             name: taskElement.querySelector('.card-title').innerText,
//             description: taskElement.querySelector('.card-text').innerText,
//             deadline: taskElement.querySelector('.card-text.text-muted').innerText.replace('Deadline: ', ''),
//             status: taskElement.querySelector('.status-date') ? taskElement.querySelector('.status-date').textContent : ''
//         };
//     }
// });
