/**
 * Saves a subtask to the current task's subtask array.
 *
 * This function adds a new subtask object to the `subtasks` array of the current task.
 * The subtask object contains a `completed` status set to false and the provided subtask value.
 *
 * @function saveSubtaskToArray
 * @param {string} subtaskValue - The value or description of the subtask to add.
 */
function saveSubtaskToArray(subtaskValue) {
   tasks[taskIndex].subtasks.push({
      completed: false,
      subtask: subtaskValue
   });
}


/**
 * Sets focus to a specified HTML element.
 *
 * This function sets the keyboard focus to the HTML element with the given ID.
 *
 * @function setToFocus
 * @param {string} element - The ID of the HTML element to set focus to.
 */
function setToFocus(element) {
   const focusElement = document.getElementById(element);
   focusElement.focus();
}


/**
 * Validates the task title input field.
 *
 * This function checks if the task title input is empty.
 * If it is, it displays an error message and adds an error class to the input field.
 */
function validateTitle() {
   let title = document.getElementById('input_title');
   if (title.value.trim() === "") {
      document.getElementById('input-validation').classList.remove("d-none");
      title.classList.add('form-error');
   }
}


/**
 * Validates the task date input field.
 *
 * This function checks if the task date input is empty.
 * If it is, it displays an error message and adds an error class to the input field.
 */
function validateDate() {
   let date = document.getElementById('date-picker');
   if (date.value.trim() === "") {
      document.getElementById('date-validation').classList.remove("d-none");
      date.classList.add('form-error');
   }
}


/**
 * Validates the task priority selection.
 *
 * This function checks if the current priority is set.
 * If it is not, it displays an error message and adds an error class to the priority elements.
 */
function validatePriority() {
   if (currentPriority === 0) {
      document.getElementById('prio-validation').classList.remove("d-none");
      urgent.classList.add('form-error');
      medium.classList.add('form-error');
      low.classList.add('form-error');
   }
}


/**
 * Validates the task category selection.
 *
 * This function checks if a task category is selected.
 * If it is not, it displays an error message and adds an error class to the category field.
 */
function validateCategory() {
   let category = document.getElementById('category_field_title');
   if (category.innerText === "Select task category") {
      document.getElementById('category-validation').classList.remove("d-none");
      document.getElementById('category_field').classList.add('form-error');
   }
}


/**
 * Validates all form fields and creates a task if all validations pass.
 *
 * This function calls individual validation functions for title, date, priority, and category.
 * If all validations pass, it creates a new task and renders all tasks on the Kanban board.
 */
function validateFormAddTask() {
   validateTitle();
   validateDate();
   validatePriority();
   validateCategory();

   let title = document.getElementById('input_title');
   let date = document.getElementById('date-picker');
   let category = document.getElementById('category_field_title');

   if (title.value.trim() !== "" && date.value.trim() !== "" && currentPriority !== 0 && category.innerText !== "Select task category") {
      createTask();
   }
   renderAllTasksOnKanban();
}


/**
 * Removes the error state from the title input field.
 *
 * This function removes the error class from the title input field and hides the validation message.
 */
function removeTitleError() {
   document.getElementById('input_title').classList.remove('form-error');
   document.getElementById('input-validation').classList.add("d-none");
}


/**
 * Removes the error state from the description textarea.
 *
 * This function removes the error class from the description textarea and hides the validation message.
 */
function removeDescriptionError() {
   document.getElementById('textarea_description').classList.remove('form-error');
   document.getElementById('textarea-validation').classList.add("d-none");
}


/**
 * Removes the error state from the date input field.
 *
 * This function removes the error class from the date input field and hides the validation message.
 */
function removeDateError() {
   document.getElementById('date-picker').classList.remove('form-error');
   document.getElementById('date-validation').classList.add("d-none");
}


/**
 * Removes the error state from the category field.
 *
 * This function removes the error class from the category field and hides the validation message.
 */
function removeCategoryError() {
   document.getElementById('category_field').classList.remove('form-error');
   document.getElementById('category-validation').classList.add("d-none");
}


/**
 * Removes the error state from a specified form element.
 *
 * This function calls the appropriate error removal function based on the element type.
 *
 * @function removeError
 * @param {string} element - The type of the form element (e.g., "title", "description", "date", "category").
 */
function removeError(element) {
   if (element === "title") {
      removeTitleError();
   }
   if (element === "description") {
      removeDescriptionError();
   }
   if (element === "date") {
      removeDateError();
   }
   if (element === "category") {
      removeCategoryError();
   }
}


/**
 * Creates a new task by saving form inputs, setting status, and updating storage.
 *
 * This function handles the creation of a new task by performing the following steps:
 * - Saves form input values to an array
 * - Saves textarea input values to an array
 * - Saves the date input value to an array
 * - Sets the initial status of the task
 * - Saves the task to remote storage
 * - Toggles a notification to indicate task creation
 * - Closes the add task overlay if not on the add task page
 * - Loads tasks from remote storage
 * - Navigates to the board view
 *
 * @async
 * @function createTask
 * @returns {Promise<void>} A promise that resolves when the task creation process is complete.
 */
async function createTask() {
   saveFormInputToArray();
   saveTextareaInputToArray();
   saveTheDateToArray();
   setTaskStatus();
   await saveTaskToRemoteStorage();
   await toggleNotification();
   if (window.location.pathname !== '/add-task-page.html') {
      closeAddTaskOverlay();
   }
   await saveTaskToRemoteStorage();
   await loadTasksToAddTasksFromRemoteStorage();
   jumpToBoard();
}


/**
 * Sets the status of the current task.
 *
 * This function adds the value of `statusVar` to the status array of the current task
 * identified by `taskIndex`.
 *
 * @function setTaskStatus
 */
function setTaskStatus() {
   tasks[taskIndex].status.push(statusVar);
}


/**
 * Saves the form input value to the current task's title array.
 *
 * This function retrieves the value from the input element with ID 'input_title'
 * and adds it to the title array of the current task identified by `taskIndex`.
 *
 * @function saveFormInputToArray
 */
function saveFormInputToArray() {
   let input = document.getElementById('input_title');
   let inputValue = input.value;
   tasks[taskIndex].title.push(inputValue);
}


/**
 * Saves the textarea input value to the current task's description array.
 *
 * This function retrieves the value from the textarea element with ID 'textarea_description'
 * and adds it to the description array of the current task identified by `taskIndex`.
 *
 * @function saveTextareaInputToArray
 */
function saveTextareaInputToArray() {
   let input = document.getElementById('textarea_description');
   let inputValue = input.value;
   tasks[taskIndex].description.push(inputValue);
}


/**
 * Saves the given priority value to the current task's priority array.
 *
 * This function removes the existing priority value (if any) from the priority array
 * of the current task identified by `taskIndex`, and adds the given priority value.
 *
 * @function savePriorityToArray
 * @param {string} Prio - The priority value to be saved.
 */
function savePriorityToArray(Prio) {
   tasks[taskIndex].priority.splice(0, 1);
   tasks[taskIndex].priority.push(Prio);
}


/**
 * Saves the given category value to the current task's category array.
 *
 * This function removes the existing category value (if any) from the category array
 * of the current task identified by `taskIndex`, and adds the given category value.
 *
 * @function saveCategoryToArray
 * @param {string} category - The category value to be saved.
 */
function saveCategoryToArray(category) {
   tasks[taskIndex].category.splice(0, 1);
   tasks[taskIndex].category.push(category);
}


/**
 * Saves the selected date to the current task's date array.
 *
 * This function retrieves the value from the date picker element with ID 'date-picker'
 * and adds it to the date array of the current task identified by `taskIndex`.
 *
 * @function saveTheDateToArray
 */
function saveTheDateToArray() {
   let dueDate = document.getElementById("date-picker").value;
   tasks[taskIndex].date.push(dueDate);
}


/**
 * Closes the accounts in the assignment dropdown and clears the dropdown contents.
 *
 * This function clears the inner HTML of the elements with IDs 'assign_list_container'
 * and 'category_dropdown', effectively closing the assignment dropdown and category dropdown.
 *
 * @function closeAccountsInAssignDropdown
 */
function closeAccountsInAssignDropdown() {
   let assign = document.getElementById('assign_list_container');
   assign.innerHTML = "";
   let category = document.getElementById('category_dropdown');
   category.innerHTML = "";
}


/**
 * Saves the current tasks array to remote storage.
 *
 * This asynchronous function serializes the tasks array to a JSON string
 * and saves it to remote storage using the setItem function.
 *
 * @async
 * @function saveTaskToRemoteStorage
 * @returns {Promise<void>} A promise that resolves when the tasks have been successfully saved to remote storage.
 */
async function saveTaskToRemoteStorage() {
   await setItem('tasks', JSON.stringify(tasks));
}


/**
 * Deletes the current task and resets the input fields.
 *
 * This asynchronous function removes the current task from the tasks array,
 * clears all input fields, resets the form to its initial state, and then
 * saves the updated tasks array to remote storage.
 *
 * @async
 * @function deleteTask
 * @returns {Promise<void>} A promise that resolves when the task has been deleted and the tasks have been saved to remote storage.
 */
async function deleteTask() {
   tasks.splice(taskIndex, 1);
   document.getElementById('input_title').value = "";
   document.getElementById('textarea_description').value = "";
   document.getElementById('search_accounts_to_assign').value = "";
   document.getElementById('date-picker').value = "";
   document.getElementById('subtask_input').value = "";
   document.getElementById('form_assign_badge').innerHTML = "";
   document.getElementById('category_field_title').innerHTML = "Select task category";
   document.getElementById('ul_subtask_task').innerHTML = "";
   clearPriority();
   addToTasks();
   await saveTaskToRemoteStorage();
}


