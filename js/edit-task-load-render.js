let editTask

/**
 * Loads the task edit overlay and initializes task editing.
 *
 * This asynchronous function sets the editTask flag, displays the edit overlay, hides the task overview overlay,
 * and calls functions to render the task background and content. It also adds an event listener to close the overlay
 * when clicking outside of it.
 *
 * @async
 * @function loadTaskEdit
 * @param {number} taskID - The ID of the task to edit.
 * @returns {Promise<void>} A promise that resolves when the task edit overlay is loaded.
 */
async function loadTaskEdit(taskID) {
      editTask = true;
      showEditTaskOverlay();
      hideTaskOverviewOverlay();
      initializeTaskEdit(taskID);
      addEditOverlayClickListener(taskID);
  }
  

  /**
   * Displays the edit task overlay.
   *
   * This function removes the 'd-none' class from the edit task overlay to make it visible.
   *
   * @function showEditTaskOverlay
   */
  function showEditTaskOverlay() {
      let overlay = document.getElementById('edit-task-overlay');
      overlay.classList.remove('d-none');
  }
  

  /**
   * Hides the task overview overlay.
   *
   * This function adds the 'd-none' class to the task overview overlay to hide it.
   *
   * @function hideTaskOverviewOverlay
   */
  function hideTaskOverviewOverlay() {
      document.getElementById('task-overview-overlay').classList.add('d-none');
  }
  

  /**
   * Initializes task editing by rendering the background and content.
   *
   * This function renders the task background and content, and adds event listeners to the subtask field.
   *
   * @function initializeTaskEdit
   * @param {number} taskID - The ID of the task to edit.
   */
  function initializeTaskEdit(taskID) {
      renderEditTaskBackground();
      renderEditTaskContent(taskID);
      addEventlistenerToSubtaskField();
  }
  

  /**
   * Adds a click listener to close the edit task overlay when clicking outside.
   *
   * This function adds an event listener to the edit task overlay to close it when clicking outside of it.
   *
   * @function addEditOverlayClickListener
   * @param {number} taskID - The ID of the task to edit.
   */
  function addEditOverlayClickListener(taskID) {
      document.getElementById('edit-task-overlay').addEventListener('click', function (event) {
          if (event.target === this) {
              closeEditOverlay(taskID);  // Use the existing closeForm function to close the modal
          }
      });
  }
  

/**
 * Loads the task edit overlay and initializes task editing.
 *
 * This asynchronous function sets the editTask flag, displays the edit overlay, hides the task overview overlay,
 * and calls functions to render the task background and content. It also adds an event listener to close the overlay
 * when clicking outside of it.
 *
 * @async
 * @function loadTaskEdit
 * @param {number} taskID - The ID of the task to edit.
 * @returns {Promise<void>} A promise that resolves when the task edit overlay is loaded.
 */
async function loadTaskEdit(taskID) {
      editTask = true;
      showEditTaskOverlay();
      hideTaskOverviewOverlay();
      initializeTaskEdit(taskID);
      addEditOverlayClickListener(taskID);
  }
  
  
  /**
   * Displays the edit task overlay.
   *
   * This function removes the 'd-none' class from the edit task overlay to make it visible.
   *
   * @function showEditTaskOverlay
   */
  function showEditTaskOverlay() {
      let overlay = document.getElementById('edit-task-overlay');
      overlay.classList.remove('d-none');
  }
  

  /**
   * Hides the task overview overlay.
   *
   * This function adds the 'd-none' class to the task overview overlay to hide it.
   *
   * @function hideTaskOverviewOverlay
   */
  function hideTaskOverviewOverlay() {
      document.getElementById('task-overview-overlay').classList.add('d-none');
  }
  

  /**
   * Initializes task editing by rendering the background and content.
   *
   * This function renders the task background and content, and adds event listeners to the subtask field.
   *
   * @function initializeTaskEdit
   * @param {number} taskID - The ID of the task to edit.
   */
  function initializeTaskEdit(taskID) {
      renderEditTaskBackground();
      renderEditTaskContent(taskID);
      addEventlistenerToSubtaskField();
  }
  

  /**
   * Adds a click listener to close the edit task overlay when clicking outside.
   *
   * This function adds an event listener to the edit task overlay to close it when clicking outside of it.
   *
   * @function addEditOverlayClickListener
   * @param {number} taskID - The ID of the task to edit.
   */
  function addEditOverlayClickListener(taskID) {
      document.getElementById('edit-task-overlay').addEventListener('click', function (event) {
          if (event.target === this) {
              closeEditOverlay(taskID);  // Use the existing closeForm function to close the modal
          }
      });
  }
  

  /**
   * Closes the edit task overlay and reloads tasks.
   *
   * This asynchronous function loads tasks from remote storage, sets the editTask flag to false,
   * hides the edit task overlay, and loads the task overview.
   *
   * @async
   * @function closeEditOverlay
   * @param {number} taskID - The ID of the task to reload.
   * @returns {Promise<void>} A promise that resolves when the overlay is closed.
   */
  async function closeEditOverlay(taskID) {
      await loadTasksToAddTasksFromRemoteStorage();
      editTask = false;
      hideEditTaskOverlay();
      loadTaskOverview(taskID);
  }
  

  /**
   * Hides the edit task overlay.
   *
   * This function adds the 'd-none' class to the edit task overlay to hide it.
   *
   * @function hideEditTaskOverlay
   */
  function hideEditTaskOverlay() {
      let overlay = document.getElementById('edit-task-overlay');
      overlay.classList.add('d-none');
  }
  

  /**
   * Renders the background for the edit task overlay.
   *
   * This function sets the inner HTML of the edit task overlay to display the task wrapper and container.
   *
   * @function renderEditTaskBackground
   */
  function renderEditTaskBackground() {
      let overlay = document.getElementById('edit-task-overlay');
      overlay.innerHTML = /*html*/`
          <div id="edit-task-wrapper" class="edit-task-wrapper">
              <div id="edit-task-container" class="edit-task-container"></div>
          </div>
      `;
  }
  

/**
 * Renders the content for the edit task overlay.
 *
 * This function sets the inner HTML of the edit task container, initializes the task's status variable,
 * and calls various functions to load different parts of the task (header, status, category, title, description,
 * date, priority, assigned users, subtasks, and OK button). It also renders subtasks and adds an event listener
 * to the subtask field.
 *
 * @function renderEditTaskContent
 * @param {number} taskID - The ID of the task to edit.
 */
function renderEditTaskContent(taskID) {
      let container = document.getElementById('edit-task-container');
      let task = tasks[taskID];
      container.innerHTML = "";
      statusVar = task.status;
  
      loadOverlayHeader(container, taskID);
      loadStatusInEditTask(container, taskID);
      loadCategoryInEditTask(task, container);
      loadTitleInEditTask(task, container);
      loadDescriptionInEditTask(task, container);
      loadDateInEditTask(task, container);
      loadPriorityInEditTask(task, container);
      loadAssignedInEditTask(task, container, taskID);
      loadAssignedBadgesInEditTask(task);
      loadSubtasksInEditTask(container, task);
      loadOkButtonInEditTask(container, taskID);
      renderSubtasks();
      addEventlistenerToSubtaskField();
  }
  

/**
 * Loads the status of the task in the edit task overlay.
 *
 * This function retrieves the task's status, renders the status HTML, and sets the status button.
 *
 * @function loadStatusInEditTask
 * @param {HTMLElement} container - The container element where the status will be loaded.
 * @param {number} taskID - The ID of the task to load the status for.
 */
function loadStatusInEditTask(container, taskID) {
      let task = tasks[taskID];
      let taskStatus = task.status;
      renderStatusHTML(container, taskID);
      setStatusButton(taskID);
  }
  

  /**
   * Sets the status of the task.
   *
   * This function updates the task's status and sets the status button accordingly.
   *
   * @function setStatus
   * @param {string} state - The new status to set for the task.
   * @param {number} taskID - The ID of the task to set the status for.
   */
  function setStatus(state, taskID) {
      let task = tasks[taskID];
      task.status = state;
      setStatusButton(taskID);
  }
  

  /**
   * Sets the status button for the task.
   *
   * This function retrieves the task's status, resets all status buttons, and updates the status button.
   *
   * @function setStatusButton
   * @param {number} taskID - The ID of the task to set the status button for.
   */
  function setStatusButton(taskID) {
      let task = getTaskStatus(taskID);
      resetAllStatusButtons();
      updateStatusButton(task.status);
  }
  

  /**
   * Retrieves the status of the task.
   *
   * This function returns the task object for the given task ID.
   *
   * @function getTaskStatus
   * @param {number} taskID - The ID of the task to retrieve.
   * @returns {Object} The task object with the given task ID.
   */
  function getTaskStatus(taskID) {
      return tasks[taskID];
  }


/**
 * Loads the status of the task in the edit task overlay.
 *
 * This function retrieves the task's status, renders the status HTML, and sets the status button.
 *
 * @function loadStatusInEditTask
 * @param {HTMLElement} container - The container element where the status will be loaded.
 * @param {number} taskID - The ID of the task to load the status for.
 */
function loadStatusInEditTask(container, taskID) {
      let task = tasks[taskID];
      let taskStatus = task.status;
      renderStatusHTML(container, taskID);
      setStatusButton(taskID);
  }
  

  /**
   * Sets the status of the task.
   *
   * This function updates the task's status and sets the status button accordingly.
   *
   * @function setStatus
   * @param {string} state - The new status to set for the task.
   * @param {number} taskID - The ID of the task to set the status for.
   */
  function setStatus(state, taskID) {
      let task = tasks[taskID];
      task.status = state;
      setStatusButton(taskID);
  }

  
  /**
   * Sets the status button for the task.
   *
   * This function retrieves the task's status, resets all status buttons, and updates the status button.
   *
   * @function setStatusButton
   * @param {number} taskID - The ID of the task to set the status button for.
   */
  function setStatusButton(taskID) {
      let task = getTaskStatus(taskID);
      resetAllStatusButtons();
      updateStatusButton(task.status);
  }
  

  /**
   * Resets all status buttons.
   *
   * This function removes the 'status-active' class from all status buttons.
   *
   * @function resetAllStatusButtons
   */
  function resetAllStatusButtons() {
      document.getElementById('statusToDo').classList.remove('status-active');
      document.getElementById('statusProgress').classList.remove('status-active');
      document.getElementById('statusAwait').classList.remove('status-active');
      document.getElementById('statusDone').classList.remove('status-active');
  }

  
  /**
   * Updates the status button based on the task's status.
   *
   * This function adds the 'status-active' class to the status button that matches the task's status.
   *
   * @function updateStatusButton
   * @param {string} status - The status of the task.
   */
  function updateStatusButton(status) {
      if (status === 'to-do-column') {
          activateStatusToDo();
      } else if (status === 'in-progress-column') {
          activateStatusProgress();
      } else if (status === 'await-feedback-column') {
          activateStatusAwait();
      } else if (status === 'done-column') {
          activateStatusDone();
      }
  }

  
  /**
   * Activates the 'To Do' status button.
   *
   * This function adds the 'status-active' class to the 'To Do' status button.
   *
   * @function activateStatusToDo
   */
  function activateStatusToDo() {
      document.getElementById('statusToDo').classList.add('status-active');
      document.getElementById('statusProgress').classList.remove('status-active');
      document.getElementById('statusAwait').classList.remove('status-active');
      document.getElementById('statusDone').classList.remove('status-active');
  }

  
  /**
   * Activates the 'In Progress' status button.
   *
   * This function adds the 'status-active' class to the 'In Progress' status button.
   *
   * @function activateStatusProgress
   */
  function activateStatusProgress() {
      document.getElementById('statusToDo').classList.remove('status-active');
      document.getElementById('statusProgress').classList.add('status-active');
      document.getElementById('statusAwait').classList.remove('status-active');
      document.getElementById('statusDone').classList.remove('status-active');
  }
  

  /**
   * Activates the 'Await Feedback' status button.
   *
   * This function adds the 'status-active' class to the 'Await Feedback' status button.
   *
   * @function activateStatusAwait
   */
  function activateStatusAwait() {
      document.getElementById('statusToDo').classList.remove('status-active');
      document.getElementById('statusProgress').classList.remove('status-active');
      document.getElementById('statusAwait').classList.add('status-active');
      document.getElementById('statusDone').classList.remove('status-active');
  }
  

  /**
   * Activates the 'Done' status button.
   *
   * This function adds the 'status-active' class to the 'Done' status button.
   *
   * @function activateStatusDone
   */
  function activateStatusDone() {
      document.getElementById('statusToDo').classList.remove('status-active');
      document.getElementById('statusProgress').classList.remove('status-active');
      document.getElementById('statusAwait').classList.remove('status-active');
      document.getElementById('statusDone').classList.add('status-active');
  }
  
  
  /**
   * Retrieves the status of the task.
   *
   * This function returns the task object for the given task ID.
   *
   * @function getTaskStatus
   * @param {number} taskID - The ID of the task to retrieve.
   * @returns {Object} The task object with the given task ID.
   */
  function getTaskStatus(taskID) {
      return tasks[taskID];
  }
