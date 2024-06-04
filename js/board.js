/**
 * Initializes the Kanban board.
 *
 * This asynchronous function copies users to accounts, hides the add contact form,
 * updates tasks, renders all tasks on the Kanban board, loads login data, and updates the top bar.
 *
 * @async
 * @function initBoard
 * @returns {Promise<void>} A promise that resolves when the board is initialized.
 */
async function initBoard() {
  await copyUsersToAccounts();
  await hideAddContactForm();
  tasks = await aktualisiereTasks(tasks, accounts);
  await initRenderAllTasksOnKanban();
  await loadLoginData();
  putInitialInTopBar();
}


/**
 * Renders all tasks on the Kanban board.
 *
 * This asynchronous function loads tasks from remote storage, resets the board,
 * renders each task card on the Kanban board, checks if task columns are empty,
 * and activates event listeners.
 *
 * @async
 * @function initRenderAllTasksOnKanban
 * @returns {Promise<void>} A promise that resolves when all tasks are rendered.
 */
async function initRenderAllTasksOnKanban() {
  await loadTaskFromRemoteStorageToBoard();
  resetBoard();
  for (let i = 0; i < tasks.length; i++) {
    await renderTaskCardOnKanban(i);
  }
  await checkIfTaskColumnIsEmpty();
  activateEventListeners();
}


/**
 * Loads tasks from remote storage to the board.
 *
 * This asynchronous function retrieves tasks from remote storage,
 * filters out tasks without titles, and updates the tasks array.
 *
 * @async
 * @function loadTaskFromRemoteStorageToBoard
 * @returns {Promise<void>} A promise that resolves when tasks are loaded.
 */
async function loadTaskFromRemoteStorageToBoard() {
  tasks = JSON.parse(await getItem('tasks'));
  tasks = tasks.filter(task => task.title && task.title.length > 0);
}


/**
 * Saves tasks from the board to remote storage.
 *
 * This asynchronous function filters out tasks without titles and saves the tasks array to remote storage.
 *
 * @async
 * @function saveTaskToRemoteStorageFromBoard
 * @returns {Promise<void>} A promise that resolves when tasks are saved.
 */
async function saveTaskToRemoteStorageFromBoard() {
  tasks = tasks.filter(task => task.title && task.title.length > 0);
  await setItem('tasks', JSON.stringify(tasks));
}


/**
 * Renders all tasks on the Kanban board.
 *
 * This asynchronous function renders each task card on the Kanban board
 * and checks if task columns are empty.
 *
 * @async
 * @function renderAllTasksOnKanban
 * @returns {Promise<void>} A promise that resolves when all tasks are rendered.
 */
async function renderAllTasksOnKanban() {
  for (let i = 0; i < tasks.length; i++) {
    renderTaskCardOnKanban(i);
  }
  await checkIfTaskColumnIsEmpty();
}


/**
 * Loads tasks from remote storage.
 *
 * This asynchronous function retrieves tasks from remote storage and updates the tasks array.
 *
 * @async
 * @function loadTaskFromRemoteStorage
 * @returns {Promise<void>} A promise that resolves when tasks are loaded.
 */
async function loadTaskFromRemoteStorage() {
  tasks = JSON.parse(await getItem('tasks'));
}


/**
 * Resets the Kanban board.
 *
 * This function clears the contents of all task columns on the Kanban board.
 *
 * @function resetBoard
 */
function resetBoard() {
  document.getElementById("to-do-column").innerHTML = "";
  document.getElementById("in-progress-column").innerHTML = "";
  document.getElementById("await-feedback-column").innerHTML = "";
  document.getElementById("done-column").innerHTML = "";
}


/**
 * Checks if a task column is empty and adds a message if it is.
 *
 * This function checks if the specified task column is empty. If it is, it adds a message indicating no tasks.
 *
 * @function checkIfColumnIsEmpty
 * @param {HTMLElement} column - The task column element to check.
 * @param {string} message - The message to display if the column is empty.
 */
function checkIfColumnIsEmpty(column, message) {
  if (!column.innerHTML.trim()) {
    column.innerHTML = `<div class="notasks">${message}</div>`;
  }
}


/**
 * Checks if each task column is empty and adds a message if they are.
 *
 * This asynchronous function checks each task column (to-do, in-progress, await-feedback, done)
 * and adds a message if any of them are empty.
 *
 * @async
 * @function checkIfTaskColumnsAreEmpty
 * @returns {Promise<void>} A promise that resolves when all columns have been checked.
 */
async function checkIfTaskColumnIsEmpty() {
  let todoColumn = document.getElementById("to-do-column");
  let progressColumn = document.getElementById("in-progress-column");
  let feedbackColumn = document.getElementById("await-feedback-column");
  let doneColumn = document.getElementById("done-column");

  checkIfColumnIsEmpty(todoColumn, "No To-Do Tasks");
  checkIfColumnIsEmpty(progressColumn, "No Progress Tasks");
  checkIfColumnIsEmpty(feedbackColumn, "No Await Tasks");
  checkIfColumnIsEmpty(doneColumn, "No Done Tasks");
}


/**
 * Retrieves task data required for rendering a task card on the Kanban board.
 *
 * This function gathers necessary task data such as status, category, title, description,
 * subtasks, subtask progress, completed subtasks, and priority.
 *
 * @function getTaskData
 * @param {number} i - The index of the task in the tasks array.
 * @returns {Object} An object containing task data required for rendering.
 */
function getTaskData(i) {
  const status = getBoardTaskStatus(i);
  const category = getKanbanTaskCategory(i);
  const categoryclass = getKanbanTaskCategoryCSSClass(i);
  const title = getKanbanTaskTitle(i);
  const description = getKanbanTaskDescription(i);
  const subtasks = getLengthOfSubtasks(i);
  const subtaskprogress = getKanbanSubtaskBar(i);
  const subtaskscompleted = getCompletedTasks(i);
  const prio = getPrioForKanban(i);

  return {
    status,
    category,
    categoryclass,
    title,
    description,
    subtasks,
    subtaskprogress,
    subtaskscompleted,
    prio
  };
}


/**
 * Retrieves task data required for rendering a task card on the Kanban board.
 *
 * This function gathers necessary task data such as status, category, title, description,
 * subtasks, subtask progress, completed subtasks, and priority.
 *
 * @function getTaskDataForKanban
 * @param {number} i - The index of the task in the tasks array.
 * @returns {Object} An object containing task data required for rendering.
 */
function getTaskDataForKanban(i) {
  const status = getBoardTaskStatus(i);
  const category = getKanbanTaskCategory(i);
  const categoryclass = getKanbanTaskCategoryCSSClass(i);
  const title = getKanbanTaskTitle(i);
  const description = getKanbanTaskDescription(i);
  const subtasks = getLengthOfSubtasks(i);
  const subtaskprogress = getKanbanSubtaskBar(i);
  const subtaskscompleted = getCompletedTasks(i);
  const prio = getPrioForKanban(i);

  return {
    status,
    category,
    categoryclass,
    title,
    description,
    subtasks,
    subtaskprogress,
    subtaskscompleted,
    prio
  };
}


/**
 * Renders a task card on the Kanban board.
 *
 * This asynchronous function retrieves the task data, updates the status column,
 * renders the task card using a template, and updates the UI with assignment badges and subtask checks.
 *
 * @async
 * @function renderTaskCardOnKanban
 * @param {number} i - The index of the task in the tasks array.
 * @returns {Promise<void>} A promise that resolves when the task card is rendered.
 */
async function renderTaskCardOnKanban(i) {
  const {
    status,
    category,
    categoryclass,
    title,
    description,
    subtasks,
    subtaskprogress,
    subtaskscompleted,
    prio
  } = getTaskDataForKanban(i);

  const statusElement = document.getElementById(status);
  statusElement.innerHTML += await htmlTemplateRenderTaskCardOnKanban(
    i,
    title,
    description,
    category,
    categoryclass,
    subtasks,
    subtaskscompleted,
    subtaskprogress,
    prio
  );

  getAssignBadgesInitials(i);
  checkIfSubtaskIsEmpty(i, subtasks);
}


/**
 * Checks if the subtask list is empty and clears the subtask element if it is.
 *
 * @function checkIfSubtaskIsEmpty
 * @param {number} i - The index of the task in the tasks array.
 * @param {number} subtasks - The number of subtasks.
 */
function checkIfSubtaskIsEmpty(i, subtasks) {
  if (subtasks === 0) {
    let subtask = document.getElementById(`kanban-subtask-${i}`);
    subtask.innerHTML = '';
  }
}


/**
 * Gets the status of the task for the Kanban board.
 *
 * @function getBoardTaskStatus
 * @param {number} i - The index of the task in the tasks array.
 * @returns {string} The status of the task.
 */
function getBoardTaskStatus(i) {
  let taskStatus = tasks[i].status;
  return taskStatus;
}


/**
 * Gets the category of the task for the Kanban board.
 *
 * @function getKanbanTaskCategory
 * @param {number} i - The index of the task in the tasks array.
 * @returns {string} The category of the task.
 */
function getKanbanTaskCategory(i) {
  let category = tasks[i].category;
  return category;
}


/**
 * Gets the CSS class for the task category on the Kanban board.
 *
 * @function getKanbanTaskCategoryCSSClass
 * @param {number} i - The index of the task in the tasks array.
 * @returns {string} The CSS class for the task category.
 */
function getKanbanTaskCategoryCSSClass(i) {
  let category = tasks[i].category;
  let categoryclass;
  if (category == "User Story") {
    categoryclass = "user-story";
  }
  if (category == "Technical Task") {
    categoryclass = "technical-task";
  }
  return categoryclass;
}


/**
 * Gets the title of the task for the Kanban board.
 *
 * @function getKanbanTaskTitle
 * @param {number} i - The index of the task in the tasks array.
 * @returns {string} The title of the task.
 */
function getKanbanTaskTitle(i) {
  let title = tasks[i].title;
  return title;
}


/**
 * Gets the description of the task for the Kanban board.
 *
 * @function getKanbanTaskDescription
 * @param {number} i - The index of the task in the tasks array.
 * @returns {string} The description of the task.
 */
function getKanbanTaskDescription(i) {
  let description = tasks[i].description;
  return description;
}


/**
 * Gets the number of subtasks for the task on the Kanban board.
 *
 * @function getLengthOfSubtasks
 * @param {number} i - The index of the task in the tasks array.
 * @returns {number} The number of subtasks.
 */
function getLengthOfSubtasks(i) {
  let task = tasks[i].subtasks;
  let numberOfTasks = task.length;
  return numberOfTasks;
}


/**
 * Gets the number of completed subtasks for the task on the Kanban board.
 *
 * @function getCompletedTasks
 * @param {number} i - The index of the task in the tasks array.
 * @returns {number} The number of completed subtasks.
 */
function getCompletedTasks(i) {
  let subtasks = tasks[i].subtasks;
  let completed = 0;
  for (let j = 0; j < subtasks.length; j++) {
    if (subtasks[j].completed === true) {
      completed++;
    }
  }
  return completed;
}


/**
 * Gets the progress bar percentage for the subtasks of the task on the Kanban board.
 *
 * @function getKanbanSubtaskBar
 * @param {number} i - The index of the task in the tasks array.
 * @returns {string} The subtask progress percentage.
 */
function getKanbanSubtaskBar(i) {
  let subtasks = getLengthOfSubtasks(i);
  let completed = getCompletedTasks(i);
  let subtaskProgress = `${(100 / subtasks) * completed}%`;
  return subtaskProgress;
}


/**
 * Gets the priority icon for the task on the Kanban board.
 *
 * @function getPrioForKanban
 * @param {number} i - The index of the task in the tasks array.
 * @returns {string} The HTML string for the priority icon.
 */
function getPrioForKanban(i) {
  let prio = tasks[i].priority;
  let prioIcon;
  if (prio == "Urgent") {
    prioIcon = `<img src="/assets/img/Prio_alta.svg" alt="">`;
  }
  if (prio == "Medium") {
    prioIcon = `<img src="/assets/img/Prio_media.svg" alt="">`;
  }
  if (prio == "Low") {
    prioIcon = `<img src="/assets/img/Prio_baja.svg" alt="">`;
  }
  return prioIcon;
}

