let task;

/**
 * Loads the task overview for the given task ID, including the assigned users and subtasks.
 *
 * @async
 * @function loadTaskOverview
 * @param {number} taskID - The ID of the task to load.
 * @returns {Promise<void>}
 */
async function loadTaskOverview(taskID) {
    let overlay = document.getElementById('task-overview-overlay');
    task = tasks[taskID];
    overlay.classList.remove('d-none');
    overlay.innerHTML = await htmlTemplateLoadTaskOverview(task, taskID);
    await loadOverviewAssigned(task);
    await loadSubtasksinOverview(task);
    document.getElementById('task-overview-overlay').addEventListener('click', function (event) {
        if (event.target === this) {
            closeTaskOverview(); // Close the modal if the background is clicked
        }
    });
}


/**
 * Loads the assigned users for the given task and displays them in the overview.
 *
 * @async
 * @function loadOverviewAssigned
 * @param {Object} task - The task object containing assigned users.
 * @returns {Promise<void>}
 */
async function loadOverviewAssigned(task) {
    let div = document.getElementById('overview-assigned-label-badge-container');
    let colorId = task.id;
    assigned = task.assigned;
    for (let i = 0; i < assigned.length; i++) {
        const initials = task.initials[i];
        const name = task.assigned[i];
        const color = colorId[i];
        const accountWithColorId = accounts.find(account => account.id === color);
        const colorValue = accountWithColorId ? accountWithColorId.color : 'Not found';
        div.innerHTML += /*html*/`
        <div class="overview-assign-badge-container"><div class="overview-assign-badge" style="background-color: ${colorValue};">${initials}</div> <div>${name}</div></div>
        `;
    }
}


/**
 * Loads the subtasks for the current task and displays them in the overview.
 *
 * @async
 * @function loadSubtasksinOverview
 * @returns {Promise<void>}
 */
async function loadSubtasksinOverview() {
    let div = document.getElementById('overview-subtasks');
    let subtasks = task.subtasks;
    div.innerHTML = "";
    subtasks.forEach((subtask, index) => {
        renderSubtaskItem(div, subtask, index);
    });
}


/**
 * Renders a single subtask item in the specified container.
 *
 * @function renderSubtaskItem
 * @param {HTMLElement} container - The container element to render the subtask item in.
 * @param {Object} subtask - The subtask object containing subtask details.
 * @param {number} index - The index of the subtask in the task's subtasks array.
 */
function renderSubtaskItem(container, subtask, index) {
    const { subtask: subtaskText, completed: state } = subtask;
    const subtaskHTML = state ?
        `<div class="overview-subtask-item" id="overview-subtask-item${index}" onclick="changeSubtaskStateinOverview(${index})"><img src="/assets/img/tick-box-true.svg" alt="">${subtaskText}</div>` :
        `<div class="overview-subtask-item" id="overview-subtask-item${index}" onclick="changeSubtaskStateinOverview(${index})"><img src="/assets/img/tick-box-false.svg" alt="">${subtaskText}</div>`;
    container.innerHTML += subtaskHTML;
}


/**
 * Toggles the completion state of a subtask in the overview and updates the remote storage.
 *
 * @async
 * @function changeSubtaskStateinOverview
 * @param {number} subtaskID - The ID of the subtask to toggle.
 * @returns {Promise<void>}
 */
async function changeSubtaskStateinOverview(subtaskID) {
    task.subtasks[subtaskID].completed = !task.subtasks[subtaskID].completed;
    await saveTaskToRemoteStorage();
    await loadSubtasksinOverview(task);
}


/**
 * Closes the task overview modal and reinitializes the Kanban board.
 *
 * @async
 * @function closeTaskOverview
 * @returns {Promise<void>}
 */
async function closeTaskOverview() {
    let overlay = document.getElementById('task-overview-overlay');
    overlay.classList.add('d-none');
    overlay.innerHTML = "";
    await initRenderAllTasksOnKanban();
}


/**
 * Deletes a task from the task overview and updates the remote storage.
 *
 * @async
 * @function deleteTaskFromOverview
 * @param {number} taskID - The ID of the task to delete.
 * @returns {Promise<void>}
 */
async function deleteTaskFromOverview(taskID) {
    tasks.splice(taskID, 1);
    await saveTaskToRemoteStorage();
    closeTaskOverview();
}
