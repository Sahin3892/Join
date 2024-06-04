
/**
 * Saves the edited task.
 *
 * This asynchronous function saves the form input, textarea input, and date to the task array,
 * then saves the task to remote storage, toggles a notification, and closes the edit overlay.
 *
 * @async
 * @function saveEditTask
 * @param {number} taskID - The ID of the task being saved.
 * @returns {Promise<void>} A promise that resolves when the task is saved.
 */
async function saveEditTask(taskID) {
    saveEditFormInputToArray(taskID);
    saveEditTextareaInputToArray(taskID);
    saveEditTheDateToArray(taskID);
    await saveTaskToRemoteStorage();
    await toggleNotification();
    closeEditOverlay(taskID);
}


/**
 * Saves the edited form input to the task array.
 *
 * This function updates the task's title with the value from the form input field.
 *
 * @function saveEditFormInputToArray
 * @param {number} taskID - The ID of the task being edited.
 */
function saveEditFormInputToArray(taskID) {
    let task = tasks[taskID];
    let input = document.getElementById('input_title');
    let inputValue = input.value;
    task.title = inputValue;
}


/**
 * Saves the edited textarea input to the task array.
 *
 * This function updates the task's description with the value from the textarea field.
 *
 * @function saveEditTextareaInputToArray
 * @param {number} taskID - The ID of the task being edited.
 */
function saveEditTextareaInputToArray(taskID) {
    let task = tasks[taskID];
    let input = document.getElementById('textarea_description');
    let inputValue = input.value;
    task.description = inputValue;
}


/**
 * Saves the edited date to the task array.
 *
 * This function updates the task's date with the value from the date picker field.
 *
 * @function saveEditTheDateToArray
 * @param {number} taskID - The ID of the task being edited.
 */
function saveEditTheDateToArray(taskID) {
    let task = tasks[taskID];
    let dueDate = document.getElementById("date-picker").value;
    task.date = dueDate;
}


/**
 * Validates the edit form before saving the task.
 *
 * This function validates the title, date, priority, and category fields. If all validations pass,
 * it triggers the saving of the edited task.
 *
 * @function validateEditForm
 * @param {number} taskID - The ID of the task being edited.
 */
function validateEditForm(taskID) {
    let title = document.getElementById('input_title');
    let date = document.getElementById('date-picker');
    let category = document.getElementById('category_field_title');
    let isTitleAndDateValid = validateTitleAndDate(title, date);
    let isPriorityAndCategoryValid = validatePriorityAndCategory(category);
    if (isTitleAndDateValid && isPriorityAndCategoryValid) {
        saveEditTask(taskID);
    }
}


/**
 * Validates the title and date fields.
 *
 * This function checks if the title and date fields are not empty.
 *
 * @function validateTitleAndDate
 * @param {HTMLElement} title - The title input element.
 * @param {HTMLElement} date - The date picker element.
 * @returns {boolean} True if both fields are valid, false otherwise.
 */
function validateTitleAndDate(title, date) {
    let isTitleValid = title.value.trim() !== "";
    let isDateValid = date.value.trim() !== "";
    toggleValidationMessage('input-validation', isTitleValid);
    toggleValidationMessage('date-validation', isDateValid);
    return isTitleValid && isDateValid;
}


/**
 * Validates the priority and category fields.
 *
 * This function checks if the priority and category fields are selected.
 *
 * @function validatePriorityAndCategory
 * @param {HTMLElement} category - The category field element.
 * @returns {boolean} True if both fields are valid, false otherwise.
 */
function validatePriorityAndCategory(category) {
    let isPriorityValid = currentPriority !== 0;
    let isCategoryValid = category.innerText !== "Select task category";
    toggleValidationMessage('prio-validation', isPriorityValid);
    toggleValidationMessage('category-validation', isCategoryValid);
    return isPriorityValid && isCategoryValid;
}


/**
 * Toggles the validation message display based on the validity.
 *
 * This function shows or hides the validation message based on the validity.
 *
 * @function toggleValidationMessage
 * @param {string} elementId - The ID of the validation message element.
 * @param {boolean} isValid - The validity status.
 */
function toggleValidationMessage(elementId, isValid) {
    let element = document.getElementById(elementId);
    if (isValid) {
        element.classList.add('d-none');
    } else {
        element.classList.remove('d-none');
    }
}


/**
* Validates the title and date fields.
*
* This function checks if the title and date fields are not empty. If either field is empty,
* it displays the appropriate validation message and adds the 'form-error' class to the field.
*
* @function validateTitleAndDate
* @param {HTMLElement} title - The title input element.
* @param {HTMLElement} date - The date picker element.
* @returns {boolean} True if both fields are valid, false otherwise.
*/
function validateTitleAndDate(title, date) {
    let isValid = true;
    if (title.value.trim() === "") {
        document.getElementById('input-validation').classList.remove("d-none");
        title.classList.add('form-error');
        isValid = false;
    }
    if (date.value.trim() === "") {
        document.getElementById('date-validation').classList.remove("d-none");
        date.classList.add('form-error');
        isValid = false;
    }
    return isValid;
}


/**
 * Validates the priority and category fields.
 *
 * This function checks if the priority and category fields are selected. If either field is not selected,
 * it displays the appropriate validation message and adds the 'form-error' class to the field.
 *
 * @function validatePriorityAndCategory
 * @param {HTMLElement} category - The category field element.
 * @returns {boolean} True if both fields are valid, false otherwise.
 */
function validatePriorityAndCategory(category) {
    let isValid = true;
    if (currentPriority === 0) {
        document.getElementById('prio-validation').classList.remove("d-none");
        urgent.classList.add('form-error');
        medium.classList.add('form-error');
        low.classList.add('form-error');
        isValid = false;
    }
    if (category.innerText === "Select task category") {
        document.getElementById('category-validation').classList.remove("d-none");
        document.getElementById('category_field').classList.add('form-error');
        isValid = false;
    }
    return isValid;
}


/**
 * Removes the validation error for the specified element.
 *
 * This function removes the 'form-error' class and hides the validation message for the specified element.
 *
 * @function removeEditError
 * @param {string} element - The name of the element to remove the error for ('title', 'description', 'date', 'prio', 'category').
 */
function removeEditError(element) {
    if (element === "title") {
        removeTitleError();
    } else if (element === "description") {
        removeDescriptionError();
    } else if (element === "date") {
        removeDateError();
    } else if (element === "prio") {
        removePriorityError();
    } else if (element === "category") {
        removeCategoryError();
    }
}


/**
 * Removes the validation error for the title field.
 *
 * This function removes the 'form-error' class and hides the validation message for the title field.
 *
 * @function removeTitleError
 */
function removeTitleError() {
    document.getElementById('input_title').classList.remove('form-error');
    document.getElementById('input-validation').classList.add("d-none");
}


/**
 * Removes the validation error for the description field.
 *
 * This function removes the 'form-error' class and hides the validation message for the description field.
 *
 * @function removeDescriptionError
 */
function removeDescriptionError() {
    document.getElementById('textarea_description').classList.remove('form-error');
    document.getElementById('textarea-validation').classList.add("d-none");
}


/**
 * Removes the validation error for the date field.
 *
 * This function removes the 'form-error' class and hides the validation message for the date field.
 *
 * @function removeDateError
 */
function removeDateError() {
    document.getElementById('date-picker').classList.remove('form-error');
    document.getElementById('date-validation').classList.add("d-none");
}


/**
 * Removes the validation error for the priority field.
 *
 * This function removes the 'form-error' class and hides the validation message for the priority field.
 *
 * @function removePriorityError
 */
function removePriorityError() {
    urgent.classList.remove('form-error');
    medium.classList.remove('form-error');
    low.classList.remove('form-error');
    document.getElementById('prio-validation').classList.add("d-none");
}


/**
 * Removes the validation error for the category field.
 *
 * This function removes the 'form-error' class and hides the validation message for the category field.
 *
 * @function removeCategoryError
 */
function removeCategoryError() {
    document.getElementById('category_field').classList.remove('form-error');
    document.getElementById('category-validation').classList.add("d-none");
}
