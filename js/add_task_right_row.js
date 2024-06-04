/**
 * Checks and activates the appropriate priority based on the given priority value.
 *
 * This function activates the appropriate priority (urgent, medium, low) based on the given priority value.
 *
 * @function checkPriority
 * @param {HTMLElement} urgent - The element representing the urgent priority.
 * @param {HTMLElement} medium - The element representing the medium priority.
 * @param {HTMLElement} low - The element representing the low priority.
 * @param {number} prio - The priority value (1 for urgent, 2 for medium, 3 for low).
 */
function checkPriority(urgent, medium, low, prio) {
   if (prio === 1) {
      activatePrioUrgent(urgent, medium, low);
   }
   if (prio === 2) {
      activatePrioMedium(urgent, medium, low);
   }
   if (prio === 3) {
      activatePrioLow(urgent, medium, low);
   }
}


/**
 * Deletes the current priority from the task and resets the priority elements.
 *
 * This function removes the current priority from the task's priority array and resets the priority elements to their default state.
 *
 * @function deletePriorityFromArray
 * @param {HTMLElement} urgent - The element representing the urgent priority.
 * @param {HTMLElement} medium - The element representing the medium priority.
 * @param {HTMLElement} low - The element representing the low priority.
 */
function deletePriorityFromArray(urgent, medium, low) {
   tasks[taskIndex].priority.splice(0, 1);
   urgent.classList.remove("urgent-checked");
   medium.classList.add("medium-checked");
   low.classList.remove("low-checked");
   urgent.innerHTML = /*html*/ `<p>Urgent</p><img src="/assets/img/Prio_alta.svg" alt="">`;
   medium.innerHTML = /*html*/ `<p>Medium</p><img src="/assets/img/Prio_media_white.svg" alt="">`;
   low.innerHTML = /*html*/ `<p>Low</p><img src="/assets/img/Prio_baja.svg" alt="">`;
   currentPriority = 0;
}


/**
 * Activates the urgent priority.
 *
 * This function sets the urgent priority as active and updates the corresponding elements.
 *
 * @function activatePrioUrgent
 * @param {HTMLElement} urgent - The element representing the urgent priority.
 * @param {HTMLElement} medium - The element representing the medium priority.
 * @param {HTMLElement} low - The element representing the low priority.
 */
function activatePrioUrgent(urgent, medium, low) {
   urgent.classList.add("urgent-checked");
   medium.classList.remove("medium-checked");
   low.classList.remove("low-checked");
   urgent.innerHTML = /*html*/ `<p>Urgent</p><img src="/assets/img/Prio_alta_white.svg" alt="">`;
   medium.innerHTML = /*html*/ `<p>Medium</p><img src="/assets/img/Prio_media.svg" alt="">`;
   low.innerHTML = /*html*/ `<p>Low</p><img src="/assets/img/Prio_baja.svg" alt="">`;
   savePriorityToArray("Urgent");
   currentPriority = 1;
}


/**
 * Activates the medium priority.
 *
 * This function sets the medium priority as active and updates the corresponding elements.
 *
 * @async
 * @function activatePrioMedium
 * @param {HTMLElement} urgent - The element representing the urgent priority.
 * @param {HTMLElement} medium - The element representing the medium priority.
 * @param {HTMLElement} low - The element representing the low priority.
 */
async function activatePrioMedium(urgent, medium, low) {
   urgent.classList.remove("urgent-checked");
   medium.classList.add("medium-checked");
   low.classList.remove("low-checked");
   urgent.innerHTML = /*html*/ `<p>Urgent</p><img src="/assets/img/Prio_alta.svg" alt="">`;
   medium.innerHTML = /*html*/ `<p>Medium</p><img src="/assets/img/Prio_media_white.svg" alt="">`;
   low.innerHTML = /*html*/ `<p>Low</p><img src="/assets/img/Prio_baja.svg" alt="">`;
   savePriorityToArray("Medium");
   currentPriority = 2;
}


/**
 * Activates the low priority.
 *
 * This function sets the low priority as active and updates the corresponding elements.
 *
 * @function activatePrioLow
 * @param {HTMLElement} urgent - The element representing the urgent priority.
 * @param {HTMLElement} medium - The element representing the medium priority.
 * @param {HTMLElement} low - The element representing the low priority.
 */
function activatePrioLow(urgent, medium, low) {
   urgent.classList.remove("urgent-checked");
   medium.classList.remove("medium-checked");
   low.classList.add("low-checked");
   urgent.innerHTML = /*html*/ `<p>Urgent</p><img src="/assets/img/Prio_alta.svg" alt="">`;
   medium.innerHTML = /*html*/ `<p>Medium</p><img src="/assets/img/Prio_media.svg" alt="">`;
   low.innerHTML = /*html*/ `<p>Low</p><img src="/assets/img/Prio_baja_white.svg" alt="">`;
   savePriorityToArray("Low");
   currentPriority = 3;
}


/**
 * Opens the category dropdown.
 *
 * This function populates the category dropdown with options and makes it visible.
 *
 * @function openCategoryDropdown
 */
function openCategoryDropdown() {
   let category = document.getElementById('category_dropdown');
   category.innerHTML = "";
   category.innerHTML =/*html*/ `
         <li class="category-list" onclick="setTaskCategory('Technical Task')">Technical Task</li>
         <li class="category-list" onclick="setTaskCategory('User Story')">User Story</li>
      `;
}


/**
 * Closes the category dropdown when clicking outside of it.
 *
 * This function checks if the click event occurred outside the category dropdown container and closes the dropdown if true.
 *
 * @function closeCategoryDropdownOnClickOutside
 * @param {Event} event - The click event.
 */
function closeCategoryDropdownOnClickOutside(event) {
   const category = document.getElementById('category_dropdown');
   const container = document.getElementById('category_field_dropdown_container');
   if (!container.contains(event.target)) {
      // Remove the click outside event listener
      document.removeEventListener('click', closeCategoryDropdownOnClickOutside);
      isDropdownOpen = false;
      category.innerHTML = "";
   }
}

let isCategoryDropdownOpen = false;

/**
 * Toggles the visibility of the category dropdown.
 *
 * This function opens or closes the category dropdown based on its current state.
 *
 * @function toggleCategoryDropdown
 */
function toggleCategoryDropdown() {
   const category = document.getElementById('category_dropdown');
   if (isDropdownOpen) {
      category.innerHTML = "";
      isDropdownOpen = false;
   } else {
      document.addEventListener('click', closeCategoryDropdownOnClickOutside);
      openCategoryDropdown();
      isDropdownOpen = true;
   }
}


/**
 * Sets the task category and updates the dropdown.
 *
 * This function sets the selected category for the task, saves it to the array, and updates the dropdown.
 *
 * @function setTaskCategory
 * @param {string} category - The selected category.
 */
function setTaskCategory(category) {
   let title = document.getElementById('category_field_title');
   title.innerHTML = /*html*/ `${category}`;
   saveCategoryToArray(category);
   let wipeCategoryDropdown = document.getElementById('category_dropdown');
   wipeCategoryDropdown.innerHTML = "";
}


/**
 * Adds an event listener to the subtask input field to show input icons.
 *
 * This function adds an event listener to the subtask input field to show save and cancel icons when focused.
 *
 * @function addEventlistenerToSubtaskField
 */
function addEventlistenerToSubtaskField() {
   let subtaskInput = document.getElementById('subtask_input');
   if (subtaskInput) {
      subtaskInput.addEventListener('focusin', showSubtaskInputIcons);
   } else {
      console.error("Element #subtask_input not found");
   }
}


/**
 * Shows the subtask input icons when the subtask input field is focused.
 *
 * This function displays save and cancel icons next to the subtask input field.
 *
 * @function displaySubtaskInputIcons
 */
function displaySubtaskInputIcons() {
   let subtaskInputIcon = document.getElementById('subtask_input_icon');
   subtaskInputIcon.innerHTML = /*html*/ `
       <img src="/assets/img/subtask_abort.svg" alt="" onclick="resetSubtaskInput()">
       <hr>
       <img src="/assets/img/subtask_save.svg" alt="" onclick="saveSubtaskInLi()">
   `;
}


/**
* Adds event listeners to the subtask input field.
*
* This function adds event listeners to the subtask input field for Enter and Escape keys.
*
* @function addSubtaskInputEventListeners
*/
function addSubtaskInputEventListeners() {
   let subtaskInput = document.getElementById('subtask_input');
   subtaskInput.addEventListener('keydown', function (event) {
      if (event.key === 'Enter') {
         saveSubtaskInLi();
      }
   });
   subtaskInput.addEventListener('keydown', function (event) {
      if (event.key === 'Escape') {
         resetSubtaskInput();
      }
   });
}


/**
* Initializes the subtask input icons and event listeners.
*
* This function displays the subtask input icons and adds the necessary event listeners
* when the subtask input field is focused.
*
* @function showSubtaskInputIcons
*/
function showSubtaskInputIcons() {
   displaySubtaskInputIcons();
   addSubtaskInputEventListeners();
}


/**
 * Saves the subtask input value to the task and updates the UI.
 *
 * This function saves the subtask input value to the current task's subtasks array, updates the UI, and resets the input field.
 *
 * @function saveSubtaskInLi
 */
function saveSubtaskInLi() {
   let subtaskInput = document.getElementById('subtask_input');
   let ul_subtask = document.getElementById('ul_subtask_task');
   let subtaskValue = subtaskInput.value;
   if (subtaskValue.trim() !== '') {
      saveSubtaskToArray(subtaskValue);
      let subtaskIndex = tasks[taskIndex].subtasks.length - 1;
      ul_subtask.innerHTML += htmlTemplateSaveSubtaskInLi(subtaskValue, subtaskIndex);
      resetSubtaskInput();
      subtaskInput.focus();
   }
}


/**
 * Shows the subtask edit icons for a specific subtask.
 *
 * This function makes the edit icons for a specific subtask visible.
 *
 * @function showSubtaskEditIcons
 * @param {number} i - The index of the subtask.
 */
function showSubtaskEditIcons(i) {
   let subtask = document.getElementById(`li${i}`);
   subtask.classList.remove("d-none");
}


/**
 * Hides the subtask edit icons for a specific subtask.
 *
 * This function hides the edit icons for a specific subtask.
 *
 * @function hideSubtaskEditIcons
 * @param {number} i - The index of the subtask.
 */
function hideSubtaskEditIcons(i) {
   let subtask = document.getElementById(`li${i}`);
   subtask.classList.add("d-none");
}


/**
 * Resets the subtask input field and updates the UI.
 *
 * This function clears the subtask input field, removes focus, and updates the subtask input icons.
 *
 * @function resetSubtaskInput
 */
function resetSubtaskInput() {
   let subtaskInput = document.getElementById('subtask_input');
   subtaskInput.blur();
   subtaskInput.value = '';
   let subtaskInputIcon = document.getElementById('subtask_input_icon');
   subtaskInputIcon.innerHTML = /*html*/ `
         <img src="/assets/img/subtask_add.svg" alt="">
      `;
   renderSubtasks(); // Update the view
}


/**
 * Deletes a subtask from the current task and updates the UI.
 *
 * This function removes a subtask at the specified index from the current task's subtasks array and updates the UI.
 *
 * @function deleteSubtask
 * @param {number} i - The index of the subtask to delete.
 */
function deleteSubtask(i) {
   const subtasks = tasks[taskIndex].subtasks;
   if (i >= 0 && i < subtasks.length) {
      subtasks.splice(i, 1); // Delete the subtask object at position i
      renderSubtasks(); // Update the view
   }
}


/**
 * Enables editing for a specific subtask.
 *
 * This function enables the input field for editing a specific subtask and hides the delete and edit buttons.
 *
 * @function editSubtask
 * @param {number} i - The index of the subtask to edit.
 */
function editSubtask(i) {
   const subtask = tasks[taskIndex].subtasks[i];
   const inputElement = document.getElementById(`subtask-edit-input-${i}`);
   if (inputElement) {
      inputElement.disabled = false;
      inputElement.focus(); // Optional: Focus the input element
      hideSubtaskDeleteAndEditButtons(i);
   }
}


/**
 * Saves the edited value of a specific subtask.
 *
 * This function saves the edited value of a specific subtask and updates the UI.
 *
 * @function saveEditedSubtask
 * @param {number} i - The index of the subtask to save.
 */
function saveEditedSubtask(i) {
   let editedTask = document.getElementById(`subtask-edit-input-${i}`);
   let input = editedTask.value;
   tasks[taskIndex].subtasks[i].subtask = input;
   showSubtaskDeleteAndEditButtons(i);
   renderSubtasks(); // Update the view
}


/**
 * Resets a subtask to its original value.
 *
 * This function resets the value of a specific subtask to its original value and updates the UI.
 *
 * @function resetSubtask
 * @param {number} i - The index of the subtask to reset.
 * @param {string} subtaskentry - The original value of the subtask.
 */
function resetSubtask(i, subtaskentry) {
   document.getElementById(`subtask-edit-input-${i}`).value = subtaskentry;
   showSubtaskDeleteAndEditButtons(i);
   renderSubtasksHtmlTemplate(subtaskentry, i);
   renderSubtasks(); // Update the view
}


/**
 * Hides the delete and edit buttons for a specific subtask.
 *
 * This function hides the delete and edit buttons for a specific subtask and shows the close and abort buttons.
 *
 * @function hideSubtaskDeleteAndEditButtons
 * @param {number} i - The index of the subtask.
 */
function hideSubtaskDeleteAndEditButtons(i) {
   document.getElementById(`subtask-delete-${i}`).classList.add('d-none');
   document.getElementById(`subtask-edit-${i}`).classList.add('d-none');
   document.getElementById(`subtask-close-${i}`).classList.remove('d-none');
   document.getElementById(`subtask-abort-${i}`).classList.remove('d-none');
}


/**
 * Shows the delete and edit buttons for a specific subtask.
 *
 * This function shows the delete and edit buttons for a specific subtask and hides the close and abort buttons.
 *
 * @function showSubtaskDeleteAndEditButtons
 * @param {number} i - The index of the subtask.
 */
function showSubtaskDeleteAndEditButtons(i) {
   const inputElement = document.getElementById(`subtask-edit-input-${i}`);
   inputElement.disabled = true;
   document.getElementById(`subtask-delete-${i}`).classList.remove('d-none');
   document.getElementById(`subtask-edit-${i}`).classList.remove('d-none');
   document.getElementById(`subtask-close-${i}`).classList.add('d-none');
   document.getElementById(`subtask-abort-${i}`).classList.add('d-none');
}


/**
 * Renders the list of subtasks for the current task.
 *
 * This function updates the UI to display the subtasks for the current task.
 *
 * @function renderSubtasks
 */
function renderSubtasks() {
   let liSubtask = document.getElementById('ul_subtask_task');
   liSubtask.innerHTML = "";
   const subtasks = tasks[taskIndex].subtasks;
   for (let i = 0; i < subtasks.length; i++) {
      const subtaskentry = tasks[taskIndex].subtasks[i].subtask;
      liSubtask.innerHTML += renderSubtasksHtmlTemplate(subtaskentry, i);
   }
}
