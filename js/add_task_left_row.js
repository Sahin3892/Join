/**
 * Clears the priority selection and resets the priority buttons to their default state.
 *
 * This function removes the checked state from the urgent and low priority buttons,
 * and adds the checked state to the medium priority button. It also resets the inner HTML
 * of each priority button to its default state and sets the current priority to 0.
 *
 * @function clearPriority
 */
function clearPriority() {
   let urgent = document.getElementById('urgent');
   let medium = document.getElementById('medium');
   let low = document.getElementById('low');
   urgent.classList.remove("urgent-checked");
   medium.classList.add("medium-checked");
   low.classList.remove("low-checked");
   urgent.innerHTML = /*html*/ `<p>Urgent</p><img src="/assets/img/Prio_alta.svg" alt="">`;
   medium.innerHTML = /*html*/ `<p>Medium</p><img src="/assets/img/Prio_media_white.svg" alt="">`;
   low.innerHTML = /*html*/ `<p>Low</p><img src="/assets/img/Prio_baja.svg" alt="">`;
   currentPriority = 0;
}


/**
 * Closes the add task overlay and deletes the current task.
 *
 * This asynchronous function first deletes the current task and then removes it from the tasks array.
 * It saves the updated tasks array to remote storage and closes the add task overlay.
 *
 * @async
 * @function closeAndDeleteAddTask
 * @returns {Promise<void>} A promise that resolves when the task has been deleted, the tasks have been saved to remote storage, and the overlay has been closed.
 */
async function closeAndDeleteAddTask() {
   await deleteTask();
   tasks.splice(taskIndex, 1);
   await saveTaskToRemoteStorage();
   await closeAddTaskOverlay();
}


/**
 * Opens the add task page and initializes the task creation process.
 *
 * This asynchronous function sets the status variable to "to-do-column",
 * loads the users, and initializes the task creation process.
 *
 * @async
 * @function openAddTaskPage
 * @returns {Promise<void>} A promise that resolves when the task page is opened and initialized.
 */
async function openAddTaskPage() {
   statusVar = "to-do-column";
   await loadUsers();
   await initAddTask();
}


/**
 * Sets up the add task overlay by making it visible and setting its content.
 *
 * This function makes the add task overlay visible, sets its inner HTML with the
 * specified template, and sets the status variable for the new task.
 *
 * @function setupAddTaskOverlay
 * @param {string} status - The status to set for the new task.
 */
function setupAddTaskOverlay(status) {
   let overlay = document.getElementById('add-task-overlay');
   overlay.classList.remove('d-none');
   
   let template = "add-task.html";
   let elementID = "add-task-overlay-container";
   overlay.innerHTML = getHtmlTemplate(template, elementID);
   
   statusVar = status;
}


/**
 * Initializes the add task overlay by including HTML and setting up event listeners.
 *
 * This asynchronous function includes the necessary HTML, adds a close button to the overlay,
 * and adds an event listener to close the overlay if the background is clicked. It also initializes
 * the task creation process.
 *
 * @async
 * @function initializeAddTaskOverlay
 * @returns {Promise<void>} A promise that resolves when the overlay is initialized.
 */
async function initializeAddTaskOverlay() {
   await includeHTML();
   addCloseButtonToOverlay();
   
   document.getElementById('add-task-overlay').addEventListener('click', function (event) {
      // Check if the clicked element is the background
      if (event.target === this) {
         closeAndDeleteAddTask();  // Use the existing closeForm function to close the modal
      }
   });
   
   await initAddTask();
}


/**
 * Opens the add task overlay and initializes the task creation process.
 *
 * This asynchronous function sets up the add task overlay and initializes it,
 * including adding event listeners for user interactions.
 *
 * @async
 * @function openAddTaskOverlay
 * @param {string} status - The status to set for the new task.
 * @returns {Promise<void>} A promise that resolves when the overlay is opened and initialized.
 */
async function openAddTaskOverlay(status) {
   setupAddTaskOverlay(status);
   await initializeAddTaskOverlay();
}


/**
 * Adds a close button to the add task overlay header.
 *
 * This function appends an image element that acts as a close button to the header of the add task overlay.
 * The close button, when clicked, calls the `closeAndDeleteAddTask` function to close the overlay.
 *
 * @function addCloseButtonToOverlay
 */
function addCloseButtonToOverlay() {
   document.getElementById('addtask_header').innerHTML += `
      <img class="pointer" onclick="closeAndDeleteAddTask()" src="/assets/img/Close.svg" alt="Close">
   `;
}


/**
 * Closes the add task overlay, updates the status, and renders all tasks on the Kanban board.
 *
 * This asynchronous function hides the add task overlay by adding a CSS class,
 * clears its inner HTML content, updates the status variable, and initializes
 * the rendering of all tasks on the Kanban board.
 *
 * @async
 * @function closeAddTaskOverlay
 * @param {string} status - The status to set for the task.
 * @returns {Promise<void>} A promise that resolves when the overlay is closed and the tasks have been rendered.
 */
async function closeAddTaskOverlay(status) {
   let overlay = document.getElementById('add-task-overlay');
   overlay.classList.add('d-none');
   overlay.innerHTML = "";
   statusVar = status;
   await initRenderAllTasksOnKanban();
}


/**
 * Deletes all tasks from remote storage and reloads the tasks.
 *
 * This asynchronous function clears the `tasks` array, saves the empty array to remote storage,
 * and then reloads the tasks from remote storage.
 *
 * @async
 * @function deleteTasksFromRemoteStorage
 * @returns {Promise<void>} A promise that resolves when the tasks have been deleted and reloaded.
 */
async function deleteTasksFromRemoteStorage() {
   tasks = [];
   await saveTaskToRemoteStorage();
   await loadTasksToAddTasksFromRemoteStorage();
}


/**
 * Toggles the visibility of the task success notification.
 *
 * This function returns a promise that toggles the visibility of the notification element
 * with a fade-in and fade-out effect. It adds the 'add-task-opak' class to make the notification
 * visible, waits for 1.5 seconds, and then removes the class to hide the notification.
 *
 * @function toggleNotification
 * @returns {Promise<void>} A promise that resolves after the notification has been shown and hidden.
 */
function toggleNotification() {
   return new Promise((resolve) => {
      const notificationElement = document.querySelector('.add-task-success');
      notificationElement.classList.add('add-task-opak');
      setTimeout(() => {
         notificationElement.classList.remove('add-task-opak');
         setTimeout(resolve, 500);
      }, 1500);
   });
}


/**
 * Redirects to the board page if currently on the add task page.
 *
 * This function checks if the current URL path is '/add-task-page.html'.
 * If it is, it redirects the browser to '/board.html'.
 *
 * @function jumpToBoard
 */
function jumpToBoard() {
   if (window.location.pathname === '/add-task-page.html') {
      window.location.href = '/board.html';
   }
}


/**
 * Updates tasks by filtering out invalid assigned names and their corresponding initials.
 *
 * This function takes a list of tasks and a list of accounts, then filters out
 * any assigned names in the tasks that are not present in the accounts. It also
 * updates the initials array to ensure consistency with the filtered assigned names.
 *
 * @function aktualisiereTasks
 * @param {Array<Object>} tasks - The array of task objects to be updated.
 * @param {Array<Object>} accounts - The array of account objects containing valid names.
 * @returns {Array<Object>} The updated array of tasks.
 */
function aktualisiereTasks(tasks, accounts) {
   const gueltigeNamen = new Set(accounts.map(account => account.name));
   tasks.forEach(task => {
      const gueltigeIndizes = [];
      task.assigned = task.assigned.filter((name, index) => {
         const isValid = gueltigeNamen.has(name);
         if (isValid) {
            gueltigeIndizes.push(index);
         }
         return isValid;
      });
      task.initials = task.initials.filter((_, index) => gueltigeIndizes.includes(index));
   });
   return tasks;
}


  /**
 * Updates the task assignment status of an account and updates the UI accordingly.
 *
 * This function checks if the account with the given ID is not assigned to the current task.
 * If not, it assigns the account to the task by updating the assigned names, initials, and IDs,
 * and adds a badge to the UI. If the account is already assigned, it removes the assignment and
 * the corresponding badge from the UI. It then filters the accounts in the assignment dropdown.
 *
 * @function ifAccountIsNotAssigned
 * @param {number} i - The index of the account in the accounts array.
 * @param {number} accountId - The ID of the account to check.
 * @param {Array<number>} assignedIds - An array of IDs representing the accounts assigned to the current task.
 * @param {HTMLElement} badge - The badge element where the assigned account's initials will be displayed.
 * @param {number} index - The index of the account name in the task's assigned array.
 * @param {HTMLElement} assignbadge - The badge element for the assigned account.
 */
  function ifAccountIsNotAssigned(i, accountId, assignedIds, badge, index, assignbadge) {
   updateTaskAssignment(i, accountId, assignedIds, badge);
   removeTaskAssignment(i, index, assignbadge);
   filterAccountsToAssign();
}


/**
* Sets the minimum selectable date in the date picker to the current date.
*
* This function retrieves the current date and formats it as `YYYY-MM-DD`.
* It then sets this date as the minimum selectable date in the date picker element.
*
* @function allowCurrentDateOnly
*/
function allowCurrentDateOnly() {
   let heute = new Date();
   let tag = heute.getDate().toString().padStart(2, '0');
   let monat = (heute.getMonth() + 1).toString().padStart(2, '0'); // Months are from 0 to 11
   let jahr = heute.getFullYear();
   document.getElementById('date-picker').min = `${jahr}-${monat}-${tag}`;
}


let isDropdownOpen = false;

/**
* Toggles the visibility of the assignment dropdown.
*
* This function toggles the visibility of the dropdown menu for assigning tasks.
* It adds or removes a CSS class to hide or show the dropdown based on its current state.
* If the dropdown is opened, it also adds an event listener to close the dropdown when
* clicking outside of it.
*
* @function toggleDropdown
*/
function toggleDropdown() {
   const dropdown = document.getElementById('assign_list_container');
   if (isDropdownOpen) {
         dropdown.classList.add('d-none');
         isDropdownOpen = false;
   } else {
         dropdown.classList.remove('d-none');
         isDropdownOpen = true;
         document.addEventListener('click', closeDropdownOnClickOutside);
   }
}


/**
* Closes the assignment dropdown if a click is detected outside of the dropdown container.
*
* This function checks if the click event occurred outside the dropdown container.
* If so, it hides the dropdown, updates the dropdown state, and removes the event listener.
*
* @function closeDropdownOnClickOutside
* @param {Event} event - The click event object.
*/
function closeDropdownOnClickOutside(event) {
   const dropdown = document.getElementById('assign_list_container');
   const container = document.getElementById('form_assign_container');
   if (!container.contains(event.target)) {
         dropdown.classList.add('d-none');
         isDropdownOpen = false;
         document.removeEventListener('click', closeDropdownOnClickOutside);
   }
}


/**
* Stops the propagation of the click event.
*
* This function prevents the click event from propagating to parent elements,
* effectively stopping any parent event listeners from being triggered.
*
* @function stopClickPropagation
* @param {Event} event - The click event object.
*/
function stopClickPropagation(event) {
   event.stopPropagation();
}


/**
* Opens the assignment dropdown when input is detected.
*
* This function removes the CSS class that hides the dropdown and sets the
* dropdown state to open.
*
* @function openDropdownOnInput
*/
function openDropdownOnInput() {
   const dropdown = document.getElementById('assign_list');
   dropdown.classList.remove('d-none');
   isDropdownOpen = true;
}


let currentPriority = 0;


/**
* Sets the priority of a task and updates the UI accordingly.
*
* This function checks if the provided priority is different from the current priority.
* If it is, it calls a function to update the priority in the UI. If the provided priority
* is the same as the current priority, it calls a function to remove the priority from the array.
*
* @function setPriority
* @param {number} prio - The priority level to set (1 for urgent, 2 for medium, 3 for low).
*/
function setPriority(prio) {
   let urgent = document.getElementById('urgent');
   let medium = document.getElementById('medium');
   let low = document.getElementById('low');

   if ((prio === 1 && prio != currentPriority) || (prio === 2 && prio != currentPriority) || (prio === 3 && prio != currentPriority)) {
         checkPriority(urgent, medium, low, prio);
   } else {
         deletePriorityFromArray(urgent, medium, low);
   }
}
