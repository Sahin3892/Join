
/**
 * Loads the overlay header for the edit task.
 *
 * This function sets the inner HTML of the container to display the edit task header with a close button.
 *
 * @function loadOverlayHeader
 * @param {HTMLElement} container - The container element where the overlay header will be loaded.
 * @param {number} taskID - The ID of the task being edited.
 */
function loadOverlayHeader(container, taskID) {
    container.innerHTML += /*html*/`
       <div class="overview-category-close">
            <h2>Edit Task</h2>
            <div class="close-icon overview-close pointer">
                <img onclick="closeEditOverlay(${taskID})" src="/assets/img/Close.svg" alt="">
            </div>
        </div>
    `;
}


/**
 * Loads the title input field in the edit task form.
 *
 * This function sets the inner HTML of the container to display the title input field with a label and validation message.
 *
 * @function loadTitleInEditTask
 * @param {Object} task - The task object containing the title.
 * @param {HTMLElement} container - The container element where the title input field will be loaded.
 */
function loadTitleInEditTask(task, container) {
    container.innerHTML += /*html*/`
        <div class="form_input_container">
            <div class="form_input_label">
                <h4>Title<span class="required">*</span></h4>
            </div>
            <input class="form_input_field" id="input_title" name="addtask_title" placeholder="Enter a Title"
                onclick="removeError('title')" required="required" value="${task.title}">
            <div class="form_input_notice">
                <p class="d-none" id="input-validation">This field is required</p>
            </div>
        </div>
    `;
}


/**
 * Loads the description textarea in the edit task form.
 *
 * This function sets the inner HTML of the container to display the description textarea with a label and validation message.
 *
 * @function loadDescriptionInEditTask
 * @param {Object} task - The task object containing the description.
 * @param {HTMLElement} container - The container element where the description textarea will be loaded.
 */
function loadDescriptionInEditTask(task, container) {
    container.innerHTML += /*html*/`
        <div class="form_textarea_container">
            <div class="form_textarea_label">
                <h4>Description</h4>
            </div>
            <textarea onclick="removeError('description')" class="form_textarea_field" id="textarea_description" name="addtask_description"
                placeholder="Enter a Description">${task.description}</textarea>
            <div class="form_textarea_notice">
                <p class="d-none" id="textarea-validation">This field is required</p>
            </div>
        </div>
    `;
}


/**
 * Loads the assigned users section in the edit task form.
 *
 * This function sets the task index and calls the renderAssignedHTML function to display the assigned users.
 *
 * @function loadAssignedInEditTask
 * @param {Object} task - The task object containing the assigned users.
 * @param {HTMLElement} container - The container element where the assigned users section will be loaded.
 * @param {number} taskID - The ID of the task being edited.
 */
function loadAssignedInEditTask(task, container, taskID) {
    taskIndex = taskID;
    renderAssignedHTML(container);
}


/**
* Loads the assigned badges in the edit task form.
*
* This function populates the badgesDiv with assigned user initials and their respective colors.
*
* @function loadAssignedBadgesInEditTask
* @param {Object} task - The task object containing assigned user initials and IDs.
*/
function loadAssignedBadgesInEditTask(task) {
    let initials = task.initials;
    let colorId = task.id;
    let badgesDiv = document.getElementById('form_assign_badge');
    badgesDiv.innerHTML = "";
    for (let i = 0; i < initials.length; i++) {
        let initial = initials[i];
        const color = colorId[i];
        const accountWithColorId = accounts.find(account => account.id === color);
        const colorValue = accountWithColorId ? accountWithColorId.color : 'Nicht gefunden';
        badgesDiv.innerHTML += /*html*/`
        <div id="assign_badge_below${i}" class="form_assign_badge" style="background-color: ${colorValue};">${initial}</div>
        `;
    }
}


/**
 * Loads the priority section in the edit task form.
 *
 * This function sets the task priority and calls functions to render the priority HTML and initialize priority buttons.
 *
 * @function loadPriorityInEditTask
 * @param {Object} task - The task object containing the priority.
 * @param {HTMLElement} container - The container element where the priority section will be loaded.
 */
function loadPriorityInEditTask(task, container) {
    taskpriority = task.priority;
    renderPriorityHTML(container);
    initializePriorityButtons(taskpriority);
}


/**
 * Initializes the priority buttons in the edit task form.
 *
 * This function retrieves the priority buttons and sets their styles based on the task priority.
 *
 * @function initializePriorityButtons
 * @param {string} taskpriority - The priority of the task.
 */
function initializePriorityButtons(taskpriority) {
    let urgent = document.getElementById('urgent');
    let medium = document.getElementById('medium');
    let low = document.getElementById('low');
    setPriorityStyles(taskpriority, urgent, medium, low);
}


/**
 * Sets the styles for the priority buttons.
 *
 * This function sets the styles for the priority buttons based on the task priority.
 *
 * @function setPriorityStyles
 * @param {string} taskpriority - The priority of the task.
 * @param {HTMLElement} urgent - The urgent priority button element.
 * @param {HTMLElement} medium - The medium priority button element.
 * @param {HTMLElement} low - The low priority button element.
 */
function setPriorityStyles(taskpriority, urgent, medium, low) {
    if (taskpriority == 'Urgent') {
        setUrgentPriorityStyles(urgent, medium, low);
    } else if (taskpriority == 'Medium') {
        setMediumPriorityStyles(urgent, medium, low);
    } else if (taskpriority == 'Low') {
        setLowPriorityStyles(urgent, medium, low);
    }
}


/**
 * Sets the styles for the urgent priority button.
 *
 * This function sets the styles for the urgent priority button and updates the current priority.
 *
 * @function setUrgentPriorityStyles
 * @param {HTMLElement} urgent - The urgent priority button element.
 * @param {HTMLElement} medium - The medium priority button element.
 * @param {HTMLElement} low - The low priority button element.
 */
function setUrgentPriorityStyles(urgent, medium, low) {
    urgent.classList.add("urgent-checked");
    medium.classList.remove("medium-checked");
    low.classList.remove("low-checked");
    urgent.innerHTML = `<p>Urgent</p><img src="/assets/img/Prio_alta_white.svg" alt="">`;
    medium.innerHTML = `<p>Medium</p><img src="/assets/img/Prio_media.svg" alt="">`;
    low.innerHTML = `<p>Low</p><img src="/assets/img/Prio_baja.svg" alt="">`;
    currentPriority = 3;
}


/**
 * Sets the styles for the medium priority button.
 *
 * This function sets the styles for the medium priority button and updates the current priority.
 *
 * @function setMediumPriorityStyles
 * @param {HTMLElement} urgent - The urgent priority button element.
 * @param {HTMLElement} medium - The medium priority button element.
 * @param {HTMLElement} low - The low priority button element.
 */
function setMediumPriorityStyles(urgent, medium, low) {
    urgent.classList.remove("urgent-checked");
    medium.classList.add("medium-checked");
    low.classList.remove("low-checked");
    urgent.innerHTML = `<p>Urgent</p><img src="/assets/img/Prio_alta.svg" alt="">`;
    medium.innerHTML = `<p>Medium</p><img src="/assets/img/Prio_media_white.svg" alt="">`;
    low.innerHTML = `<p>Low</p><img src="/assets/img/Prio_baja.svg" alt="">`;
    currentPriority = 2;
}


/**
 * Sets the styles for the low priority button.
 *
 * This function sets the styles for the low priority button and updates the current priority.
 *
 * @function setLowPriorityStyles
 * @param {HTMLElement} urgent - The urgent priority button element.
 * @param {HTMLElement} medium - The medium priority button element.
 * @param {HTMLElement} low - The low priority button element.
 */
function setLowPriorityStyles(urgent, medium, low) {
    urgent.classList.remove("urgent-checked");
    medium.classList.remove("medium-checked");
    low.classList.add("low-checked");
    urgent.innerHTML = `<p>Urgent</p><img src="/assets/img/Prio_alta.svg" alt="">`;
    medium.innerHTML = `<p>Medium</p><img src="/assets/img/Prio_media.svg" alt="">`;
    low.innerHTML = `<p>Low</p><img src="/assets/img/Prio_baja_white.svg" alt="">`;
    currentPriority = 1;
}


/**
* Sets the priority button in the edit task form.
*
* This function updates the priority buttons based on the given priority.
*
* @function setPriorityButtonInEdit
* @param {string} priority - The priority to set ('Urgent', 'Medium', 'Low').
*/
function setPriorityButtonInEdit(priority) {
    let urgent = document.getElementById('urgent-edit');
    let medium = document.getElementById('medium-edit');
    let low = document.getElementById('low-edit');
    resetPriorityButtons(urgent, medium, low);
    if (priority === 'Urgent') {
        activateUrgentPriority(urgent, medium, low);
    } else if (priority === 'Medium') {
        activateMediumPriority(urgent, medium, low);
    } else if (priority === 'Low') {
        activateLowPriority(urgent, medium, low);
    }
}


/**
 * Resets the priority buttons.
 *
 * This function removes the 'checked' class from all priority buttons.
 *
 * @function resetPriorityButtons
 * @param {HTMLElement} urgent - The urgent priority button element.
 * @param {HTMLElement} medium - The medium priority button element.
 * @param {HTMLElement} low - The low priority button element.
 */
function resetPriorityButtons(urgent, medium, low) {
    urgent.classList.remove("urgent-checked");
    medium.classList.remove("medium-checked");
    low.classList.remove("low-checked");
    urgent.innerHTML = `<p>Urgent</p><img src="/assets/img/Prio_alta.svg" alt="">`;
    medium.innerHTML = `<p>Medium</p><img src="/assets/img/Prio_media.svg" alt="">`;
    low.innerHTML = `<p>Low</p><img src="/assets/img/Prio_baja.svg" alt="">`;
}


/**
 * Activates the urgent priority button.
 *
 * This function sets the urgent priority button as active and updates the other buttons accordingly.
 *
 * @function activateUrgentPriority
 * @param {HTMLElement} urgent - The urgent priority button element.
 * @param {HTMLElement} medium - The medium priority button element.
 * @param {HTMLElement} low - The low priority button element.
 */
function activateUrgentPriority(urgent, medium, low) {
    urgent.classList.add("urgent-checked");
    medium.innerHTML = `<p>Medium</p><img src="/assets/img/Prio_media.svg" alt="">`;
    low.innerHTML = `<p>Low</p><img src="/assets/img/Prio_baja.svg" alt="">`;
    urgent.innerHTML = `<p>Urgent</p><img src="/assets/img/Prio_alta_white.svg" alt="">`;
}


/**
 * Activates the medium priority button.
 *
 * This function sets the medium priority button as active and updates the other buttons accordingly.
 *
 * @function activateMediumPriority
 * @param {HTMLElement} urgent - The urgent priority button element.
 * @param {HTMLElement} medium - The medium priority button element.
 * @param {HTMLElement} low - The low priority button element.
 */
function activateMediumPriority(urgent, medium, low) {
    medium.classList.add("medium-checked");
    urgent.innerHTML = `<p>Urgent</p><img src="/assets/img/Prio_alta.svg" alt="">`;
    low.innerHTML = `<p>Low</p><img src="/assets/img/Prio_baja.svg" alt="">`;
    medium.innerHTML = `<p>Medium</p><img src="/assets/img/Prio_media_white.svg" alt="">`;
}


/**
 * Activates the low priority button.
 *
 * This function sets the low priority button as active and updates the other buttons accordingly.
 *
 * @function activateLowPriority
 * @param {HTMLElement} urgent - The urgent priority button element.
 * @param {HTMLElement} medium - The medium priority button element.
 * @param {HTMLElement} low - The low priority button element.
 */
function activateLowPriority(urgent, medium, low) {
    low.classList.add("low-checked");
    urgent.innerHTML = `<p>Urgent</p><img src="/assets/img/Prio_alta.svg" alt="">`;
    medium.innerHTML = `<p>Medium</p><img src="/assets/img/Prio_media.svg" alt="">`;
    low.innerHTML = `<p>Low</p><img src="/assets/img/Prio_baja_white.svg" alt="">`;
}


/**
* Loads the "OK" button in the edit task form.
*
* This function adds the HTML for the "OK" button to the container, which triggers form validation and task saving.
*
* @function loadOkButtonInEditTask
* @param {HTMLElement} container - The container element where the button will be loaded.
* @param {number} taskID - The ID of the task being edited.
*/
function loadOkButtonInEditTask(container, taskID) {
    container.innerHTML += /*html*/`
      <div class="edit-button-container">
      <button type="button" onclick="validateEditForm(${taskID})" class="primary-button edit"><span>Save Task</span><img src="/assets/img/check.svg" alt=""></button>
      </div>
    `;
}



