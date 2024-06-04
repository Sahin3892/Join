/**
 * Renders a task card in the Kanban board.
 *
 * This function returns an HTML template for a task card, including details such as title, description,
 * category, subtasks, priority, and assigned badges.
 *
 * @async
 * @function htmlTemplateRenderTaskCardOnKanban
 * @param {number} i - The index of the task.
 * @param {string} title - The title of the task.
 * @param {string} description - The description of the task.
 * @param {string} category - The category of the task.
 * @param {string} categoryclass - The CSS class for the category.
 * @param {number} subtasks - The number of subtasks.
 * @param {number} subtaskscompleted - The number of completed subtasks.
 * @param {string} subtaskprogress - The progress of the subtasks as a percentage.
 * @param {string} prio - The priority of the task.
 * @returns {Promise<string>} The HTML template for the task card.
 */
async function htmlTemplateRenderTaskCardOnKanban(
  i,
  title,
  description,
  category,
  categoryclass,
  subtasks,
  subtaskscompleted,
  subtaskprogress,
  prio
) {
  return /*html*/ `
   <div draggable="true" ondragend="resetCard(${i})" ondragstart="startDragging(${i}), tiltCard(${i})" id="kanban-card-${i}" class="kanban-card pointer" onclick="loadTaskOverview(${i})">
     <div class="kanban-category-${categoryclass}">
       ${category}
     </div>
     <div class="kanban-title">
       ${title}
     </div>
     <div class="kanban-description">
       ${description}
     </div>
     <div class="kanban-subtask" id="kanban-subtask-${i}">
       <div class="kanban-subtask-progress-container" id="kanban-subtask-progress-container-${i}">
         <div class="kanban-subtask-progress-bar" id="kanban-subtask-progress-bar-${i}" style="width: ${subtaskprogress}">
         </div>
       </div>
       <div class="kanban-subtask-counter" id="kanban-subtask-counter-${i}">${subtaskscompleted}/${subtasks} Subtasks</div>
     </div>
     <div class="kanban-badge-prio-container">
       <div class="kanban-assign-prio-container">
         <div class="kanban-assign-badge-container" id="kanban-assign-to-${i}" ></div>
         <div class="kanban-prio"></div>
       </div>
       <div class="kanban-prio">${prio}</div>
     </div>
   </div>
   `;
}


/**
 * Renders the account list item if the account ID is not included in the assigned IDs.
 *
 * @function accountIdnotIncludesAssignId
 * @param {HTMLElement} assign - The container element for the assign list.
 * @param {number} i - The index of the account in the accounts array.
 * @param {number} accountId - The ID of the account.
 * @param {Array<number>} assignedIds - An array of IDs representing the accounts assigned to the current task.
 */
function accountIdnotIncludesAssignId(assign, i, accountId, assignedIds) {
  if (accounts[i].type !== 'Account') {
    assign.innerHTML += /*html*/`
               <li class="assign_li" id="assignaccount${i}" onclick="checkIfAssigned(${i}), stopClickPropagation(event)">
                     <div id="assign_badge${i}" class="form_assign_badge" style="background-color: ${accounts[i].color};">${accounts[i]['initials']}</div>
                     <div class="form_assign_name">${accounts[i]['name']}</div>
                     <img id="assigncheck${i}" src="/assets/img/checkbutton_default.svg" alt="">
               </li>`;
  }
  if (accounts[i].type === 'Account') {
    assign.innerHTML += /*html*/`
               <li class="assign_li" id="assignaccount${i}" onclick="checkIfAssigned(${i}), stopClickPropagation(event)">
                     <div id="assign_badge${i}" class="form_assign_badge" style="background-color: ${accounts[i].color};">${accounts[i]['initials']}</div>
                     <div class="form_assign_name">${accounts[i]['name']} (User)</div>
                     <img id="assigncheck${i}" src="/assets/img/checkbutton_default.svg" alt="">
               </li>`;
  }
}


/**
 * Renders the account list item if the account ID is included in the assigned IDs.
 *
 * @function accountIdIncludesAssignId
 * @param {HTMLElement} assign - The container element for the assign list.
 * @param {number} i - The index of the account in the accounts array.
 * @param {number} accountId - The ID of the account.
 * @param {Array<number>} assignedIds - An array of IDs representing the accounts assigned to the current task.
 */
function accountIdIncludesAssignId(assign, i, accountId, assignedIds) {
  if (accounts[i].type !== 'Account') {
    assign.innerHTML += /*html*/`
               <li class="assign_li selected" id="assignaccount${i}" onclick="checkIfAssigned(${i}), stopClickPropagation(event)">
                     <div id="assign_badge${i}" class="form_assign_badge" style="background-color: ${accounts[i].color};">${accounts[i]['initials']}</div>
                     <div class="form_assign_name">${accounts[i]['name']}</div>
                     <img id="assigncheck${i}" src="/assets/img/checkbutton_checked.svg" alt="">
               </li>`;
  }
  if (accounts[i].type === 'Account') {
    assign.innerHTML += /*html*/`
               <li class="assign_li selected" id="assignaccount${i}" onclick="checkIfAssigned(${i}), stopClickPropagation(event)">
                     <div id="assign_badge${i}" class="form_assign_badge" style="background-color: ${accounts[i].color};">${accounts[i]['initials']}</div>
                     <div class="form_assign_name">${accounts[i]['name']} (User)</div>
                     <img id="assigncheck${i}" src="/assets/img/checkbutton_checked.svg" alt="">
               </li>`;
  }
}


/**
 * Renders the task overview HTML template.
 *
 * This function returns an HTML template for the task overview, including details such as title, description,
 * category, due date, priority, assigned contacts, and subtasks.
 *
 * @async
 * @function htmlTemplateLoadTaskOverview
 * @param {Object} task - The task object containing task details.
 * @param {number} taskID - The ID of the task.
 * @returns {Promise<string>} The HTML template for the task overview.
 */
async function htmlTemplateLoadTaskOverview(task, taskID) {
  return /*html*/`
        <div id="overview-wrapper" class="overview-wrapper">
        <div id="overview-container" class="overview-container">
              <div class="overview-category-close">
                    <div id="overview-category">${task.category}</div>
                    <div class="close-icon overview-close pointer"><img  onclick="closeTaskOverview()" src="/assets/img/Close.svg" alt=""></div>
              </div>
              <div class="overview-title">${task.title}</div>
              <div class="overview-description">${task.description}</div>
              <div class="overview-date">
                    <div>Due Date:</div>
                    <div class="overview-date-icon"><img class="overview-priority-image" src="/assets/img/event.svg" alt=""><span>${task.date}</span></div>
              </div>
              <div class="overview-priority"><div>Priority:</div>
                    <div class="overview-priority-image-label">
                          <img class="overview-priority-image" src="/assets/img/${task.priority}.svg" alt="">
                          <span class="overview-priority-label">${task.priority}</span>
                    </div>
              </div>
              <div id="overview-assigned" class="overview-assigned">
                    <div class="overview-assigned-label">Assigned to:</div>
                    <div id="overview-assigned-label-badge-container" class="overview-assigned-label-badge-container"></div>
              </div>
              <div id="overview-subtasks-container" class="overview-subtasks-container">
                    <div class="overview-subtasks-label">Subtasks:</div>
                    <div id="overview-subtasks" class="overview-subtasks"></div>
              </div>
              <div class="overview-button-container">
                    <div>
                          <div class="btn-tertiary pointer" onclick="deleteTaskFromOverview(${taskID})">
                                <svg width="24" height="24" viewBox="0 0 24 24"  xmlns="http://www.w3.org/2000/svg">
                                <mask id="mask0_81758_217" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                <rect width="24" height="24"></rect>
                                </mask>
                                <g mask="url(#mask0_81758_217)">
                                <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.71667 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z"></path>
                                </g>
                                </svg>
                                <span>Delete</span>
                          </div>
                          <hr>
                          <div class="btn-tertiary pointer" onclick="loadTaskEdit(${taskID})">
                                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                                      <mask id="mask0_81758_502" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                                      <rect width="24" height="24"></rect>
                                      </mask>
                                      <g mask="url(#mask0_81758_502)">
                                      <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z"></path>
                                      </g>
                                </svg>
                                <span>Edit</span>
                          </div>
                    </div>
              </div>
        </div>
</div>
  `;
}


/**
 * Renders the HTML template for a subtask in the edit task view.
 *
 * @function renderSubtasksHtmlTemplate
 * @param {string} subtaskentry - The subtask entry text.
 * @param {number} i - The index of the subtask.
 * @returns {string} The HTML template for the subtask.
 */
function renderSubtasksHtmlTemplate(subtaskentry, i) {
  return /* html */  `
  <li class="li_subtask_task" id="li_subtask_task_${i}">
        <img src="/assets/img/bulletpoint.svg" alt="" class="bulletpoint">
        <input class="subtask-edit-input" id="subtask-edit-input-${i}" value="${subtaskentry}" disabled >
        <div class="li_subtask_icon" id="li${i}">
        <img src="/assets/img/delete.svg" id="subtask-delete-${i}" alt="" onclick="deleteSubtask(${i})">
        <img src="/assets/img/subtask_abort.svg" id="subtask-abort-${i}" class="d-none" alt="" onclick="resetSubtask(${i}, '${subtaskentry}')">
        <hr>
        <img src="/assets/img/subtask_edit.svg" id="subtask-edit-${i}" onclick="editSubtask(${i})" alt="">
        <img src="/assets/img/subtask_save.svg" id="subtask-close-${i}" class="d-none"   alt="" onclick="saveEditedSubtask(${i})">
        </div>
  </li>`;
}


/**
 * Renders the HTML template for a new subtask in the edit task view.
 *
 * @function htmlTemplateSaveSubtaskInLi
 * @param {string} subtaskValue - The subtask value.
 * @param {number} subtaskIndex - The index of the subtask.
 * @returns {string} The HTML template for the subtask.
 */
function htmlTemplateSaveSubtaskInLi(subtaskValue, subtaskIndex) {
  return /* html */`
<li class="li_subtask_task" id="li_subtask_task_${subtaskIndex}"  >
     <img src="/assets/img/bulletpoint.svg" alt="" class="bulletpoint">
     <input class="subtask-edit-input" id="subtask-edit-input-${subtaskIndex}" value="${subtaskValue}" disabled >
     <div class="li_subtask_icon" id="li${subtaskIndex}">
           <img src="/assets/img/delete.svg" alt="" onclick="deleteSubtask(${subtaskIndex})">
           <img src="/assets/img/subtask_abort.svg" id="subtask-abort-${subtaskIndex}" class="d-none" alt="" onclick="resetSubtask(${subtaskIndex}, '${subtaskValue}')">
           <hr>
           <img src="/assets/img/subtask_edit.svg" alt="" onclick="editSubtask(${subtaskIndex})">
           <img src="/assets/img/subtask_save.svg" id="subtask-close-${subtaskIndex}" class="d-none"   alt="" onclick="saveEditedSubtask(${subtaskIndex})">
     </div>
</li>`;
}


/**
 * Loads the category field in the edit task form.
 *
 * @function loadCategoryInEditTask
 * @param {Object} task - The task object containing task details.
 * @param {HTMLElement} container - The container element where the category field will be loaded.
 */
function loadCategoryInEditTask(task, container) {
  container.innerHTML += /*html*/`
                        <div class="category_container">
                              <div class="category_label">
                                    <h4 class="category-label-edit">Category</h4>
                              </div>
                              <div class="category_field_dropdown_container pointer" id="category_field_dropdown_container">
                                    <div class="category_field category-edit-task">
                                          <p id="category_field_title" class="category_field_title">${task.category}</p>
                                    </div>
                                    <ul id="category_dropdown" class="category_dropdown">
                                    </ul>
                              </div>
                              <div class="form_input_notice">
                                    <p id="category-validation" class="category-note">Category can't be changed.</p>
                              </div>
                        </div>
    `;
}


/**
 * Loads the subtasks field in the edit task form.
 *
 * @function loadSubtasksInEditTask
 * @param {HTMLElement} container - The container element where the subtasks field will be loaded.
 */
function loadSubtasksInEditTask(container) {
  container.innerHTML += /*html*/`
              <div class="subtask_container">
                    <div class="subtask_label">
                          <h4>Subtasks</h4>
                    </div>
                    <div class="subtask_input_container" id="subtask_input_container">
                          <input class="subtask_input" id="subtask_input" name="subtaskt_title" placeholder="Add subtask">
                          <div id="subtask_input_icon" class="subtask_input_icon pointer">
                                <img onclick="showSubtaskInputIcons()" src="/assets/img/subtask_add.svg" alt="">
                          </div>
                    </div>
                    <ul class="ul_subtask_task" id="ul_subtask_task">
                    </ul>
                    <div class="subtask_notice">
                          <p class="d-none">This field is required</p>
                    </div>
              </div>
        `;
}


/**
 * Renders the contact details in the contact details container.
 *
 * @function renderContactDetails
 * @param {Object} contact - The contact object containing contact details.
 * @param {HTMLElement} contactDetailsContainer - The container element where the contact details will be rendered.
 */
function renderContactDetails(contact, contactDetailsContainer) {
  if (contact.type === "Contact") {
    contactDetailsContainer.innerHTML = /*html*/ `
<div class="title-arrow-container" onclick="closeContactDetailsMobile()">
            <img src="/assets/img/arrow-left-line.svg" alt="">
      </div>
    <div class="contact-info">
    <div class="contact-headline">
      <span class="contact-Titel-Open">Contacts</span>
      <hr class="contact-hr" />
      <span class="contact-Titel-team">Better with a team</span>
      </div>
      <div class="contact-Open-Info">
       <div class="contact-name-initials">
          <span class="contact-Open-Initials" style="background-color: ${contact.color};">${contact.initials}</span>
          <div class="container-name-button">
              <div class="contact-name">${contact.name}</div>
                              <div class="contact-Titel-Edit-Delete">
          <div class="contact-edit" onclick="editContact(${contact.id})">
              <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
                  <mask id="mask0_89964_3876" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" />
                  </mask>
                  <g mask="url(#mask0_89964_3876)">
                  <path d="M5 19H6.4L15.025 10.375L13.625 8.975L5 17.6V19ZM19.3 8.925L15.05 4.725L16.45 3.325C16.8333 2.94167 17.3042 2.75 17.8625 2.75C18.4208 2.75 18.8917 2.94167 19.275 3.325L20.675 4.725C21.0583 5.10833 21.2583 5.57083 21.275 6.1125C21.2917 6.65417 21.1083 7.11667 20.725 7.5L19.3 8.925ZM17.85 10.4L7.25 21H3V16.75L13.6 6.15L17.85 10.4Z" />
                  </g>
              </svg>
      <span class="contact-Titel-edit-text"> Edit </span>
      </div>
          <div class="contact-edit" onclick="deleteContact('${contact.name}')">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24">
              <mask id="mask0_89964_4140" style="mask-type:alpha" maskUnits="userSpaceOnUse" x="0" y="0" width="24" height="24">
                  <rect width="24" height="24" />
              </mask>
              <g mask="url(#mask0_89964_4140)">
                  <path d="M7 21C6.45 21 5.97917 20.8042 5.5875 20.4125C5.19583 20.0208 5 19.55 5 19V6C4.71667 6 4.47917 5.90417 4.2875 5.7125C4.09583 5.52083 4 5.28333 4 5C4 4.71667 4.09583 4.47917 4.2875 4.2875C4.47917 4.09583 4.71667 4 5 4H9C9 3.71667 9.09583 3.47917 9.2875 3.2875C9.47917 3.09583 9.71667 3 10 3H14C14.2833 3 14.5208 3.09583 14.7125 3.2875C14.9042 3.47917 15 3.71667 15 4H19C19.2833 4 19.5208 4.09583 19.7125 4.2875C19.9042 4.47917 20 4.71667 20 5C20 5.28333 19.9042 5.52083 19.7125 5.7125C19.5208 5.90417 19.2833 6 19 6V19C19 19.55 18.8042 20.0208 18.4125 20.4125C18.0208 20.8042 17.55 21 17 21H7ZM7 6V19H17V6H7ZM9 16C9 16.2833 9.09583 16.5208 9.2875 16.7125C9.47917 16.9042 9.71667 17 10 17C10.2833 17 10.5208 16.9042 10.7125 16.7125C10.9042 16.5208 11 16.2833 11 16V9C11 8.71667 10.9042 8.47917 10.7125 8.2875C10.5208 8.09583 10.2833 8 10 8C9.71667 8 9.47917 8.09583 9.2875 8.2875C9.09583 8.47917 9 8.71667 9 9V16ZM13 16C13 16.2833 13.0958 16.5208 13.2875 16.7125C13.4792 16.9042 13.7167 17 14 17C14.2833 17 14.5208 16.9042 14.7125 16.7125C14.9042 16.5208 15 16.2833 15 16V9C15 8.71667 14.9042 8.47917 14.7125 8.2875C14.5208 8.09583 14.2833 8 14 8C13.71667 8 13.4792 8.09583 13.2875 8.2875C13.0958 8.47917 13 8.71667 13 9V16Z"/>
              </g>
          </svg>
          <span class="contact-Titel-edit-text">Delete</span>
      </div>
      </div>
      </div>
        </div>
      <div class="contact-Titel-contactInformation">
        <div class="contact-Titel-contactInformation-text">Contact Information</div>
        </div>
        <div class="contact-Titel-phoneEmailAddresses">
      <h4 class="kanban-title">E-Mail</h4>
      <span class="contact-mail">${contact.email}</span>
      <h4 class="kanban-title phone">Phone</h4>
      <span class="contact-mail">${contact.phone}</span>
    </div>
    </div>
  `;
  }
  if (contact.type === "Account") {
    contactDetailsContainer.innerHTML = /*html*/ `
<div class="title-arrow-container" onclick="closeContactDetailsMobile()">
            <img src="/assets/img/arrow-left-line.svg" alt="">
      </div>
    <div class="contact-info">
    <div class="contact-headline">
      <span class="contact-Titel-Open">Contacts</span>
      <hr class="contact-hr" />
      <span class="contact-Titel-team">Better with a team</span>
      </div>
      <div class="contact-Open-Info">
       <div class="contact-name-initials">
          <span class="contact-Open-Initials" style="background-color: ${contact.color};">${contact.initials}</span>
          <div class="contact-name">${contact.name} (User)</div>
       </div>
      </div>
        </div>
      <div class="contact-Titel-contactInformation">
        <div class="contact-Titel-contactInformation-text">Contact Information</div>
        </div>
        <div class="contact-Titel-phoneEmailAddresses">
        <h4 class="kanban-title">E-Mail</h4>
      <span class="contact-mail">${contact.email}</span>
    </div>
    </div>
  `;
  }
}


/**
 * Adds an initial divider to the container for sorting contacts alphabetically.
 *
 * @function addInitialDivider
 * @param {HTMLElement} container - The container element where the initial divider will be added.
 * @param {string} initial - The initial letter for the divider.
 */
function addInitialDivider(container, initial) {
  container.innerHTML += `
        <div class="initialDivider">${initial}</div>`;
}


/**
 * Renders a contact in the contact list.
 *
 * @function renderContact
 * @param {HTMLElement} container - The container element where the contact will be rendered.
 * @param {Object} contact - The contact object containing contact details.
 */
function renderContact(container, contact) {
  if (contact.type === 'Account') {
    container.innerHTML += /*html*/`
            <div class="userMainCase" data-contact-id="${contact.id}" onclick="openContact(event)">
                <div class="userInitials" style="background-color: ${contact.color};">${contact.initials}</div>
                <div class="userCase">
                    <span class="userName">${contact.name} (User)</span>
                    <span class="userMail">${contact.email}</span>
                </div>
            </div>
        `;
  } else if (contact.type === 'Contact') {
    container.innerHTML += /*html*/`
            <div class="userMainCase" data-contact-id="${contact.id}" onclick="openContact(event)">
                <div class="userInitials" style="background-color: ${contact.color};">${contact.initials}</div>
                <div class="userCase">
                    <span class="userName">${contact.name}</span>
                    <span class="userMail">${contact.email}</span>
                </div>
            </div>
        `;
  }
}


/**
 * Renders the status buttons HTML in the edit task form.
 *
 * @function renderStatusHTML
 * @param {HTMLElement} container - The container element where the status buttons will be rendered.
 * @param {number} taskID - The ID of the task.
 */
function renderStatusHTML(container, taskID) {
  container.innerHTML += /*html*/`
  <div class="prio_container">
      <div class="prio_label">
          <h4>Status</h4>
      </div>
      <div class="prio_button_container">
          <button class="prio_button" type="button" id="statusToDo" onclick="setStatus('to-do-column', ${taskID})">
              <p>To-Do</p>
          </button>
          <button class="prio_button" type="button" id="statusProgress" onclick="setStatus('in-progress-column', ${taskID})">
              <p>Progress</p>
          </button>
          <button class="prio_button" type="button" id="statusAwait" onclick="setStatus('await-feedback-column', ${taskID})">
              <p>Await Feedback</p>
          </button>
          <button class="prio_button" type="button" id="statusDone" onclick="setStatus('done-column', ${taskID})">
              <p>Done</p>
          </button>
      </div>
  </div>
  `;
}


/**
 * Renders the assigned contacts field HTML in the edit task form.
 *
 * @function renderAssignedHTML
 * @param {HTMLElement} container - The container element where the assigned contacts field will be rendered.
 */
function renderAssignedHTML(container) {
  container.innerHTML += /*html*/`
      <div class="form_assign_container">
          <div class="form_assign_label">
              <h4>Assigned to</h4>
          </div>
          <div class="form_assign_field_list_container" id="form_assign_container">
              <div class="form_assign_field_container" onclick="toggleDropdown(), filterAccountsToAssign()">
                  <input class="form_assign_field" name="assign_title" id="search_accounts_to_assign"
                      placeholder="Select contacts" oninput="openDropdownOnInput(), filterAccountsToAssign()">
                  <img src="/assets/img/arrow_drop_downaa.svg" class="pointer" alt="">
              </div>
              <div id="assign_list_container" class="d-none">
                  <div class="assign_ul_button">
                      <ul id="assign_list" class="form_assign_dropdown"></ul>
                      <div class="assign_add_contact">
                          <button type="button" onclick="addNewContact()" class="form-add-task-btn">
                              <span>Add New Contact</span>
                              <img src="/assets/img/person_add.svg" alt="">
                          </button>
                      </div>
                  </div>
              </div>
          </div>
          <div id="form_assign_badge" class="form_assign_badge_container"></div>
          <div class="form_assign_notice">
              <p class="d-none">This field is required</p>
          </div>
      </div>
  `;
}


/**
 * Loads the due date field in the edit task form.
 *
 * @function loadDateInEditTask
 * @param {Object} task - The task object containing task details.
 * @param {HTMLElement} container - The container element where the due date field will be loaded.
 */
function loadDateInEditTask(task, container) {
  container.innerHTML += /*html*/`
        <div class="form_input_container">
              <div class="form_input_label">
                    <h4>Due date<span class="required">*</span></h4>
              </div>
              <input onclick="removeError('date')" class="form_input_field date_field pointer" type="date" id="date-picker" name="datum"
                    required="required" value="${task.date}">
              <div class="form_input_notice">
                    <p id="date-validation" class="d-none">This field is required</p>
              </div>
        </div>
  `;
}


/**
 * Renders the priority buttons HTML in the edit task form.
 *
 * @function renderPriorityHTML
 * @param {HTMLElement} container - The container element where the priority buttons will be rendered.
 */
function renderPriorityHTML(container) {
  container.innerHTML += /*html*/`
      <div class="prio_container">
          <div class="prio_label">
              <h4>Priority</h4>
          </div>
          <div class="prio_button_container" onclick="removeError('prio')">
              <button class="prio_button" type="button" id="urgent" onclick="setPriority(1)">
                  <p>Urgent</p><img src="/assets/img/Prio_alta.svg" alt="">
              </button>
              <button class="prio_button" type="button" id="medium" onclick="setPriority(2)">
                  <p>Medium</p><img src="/assets/img/Prio_media_white.svg" alt="">
              </button>
              <button class="prio_button" type="button" id="low" onclick="setPriority(3)">
                  <p>Low</p><img src="/assets/img/Prio_baja.svg" alt="">
              </button>
          </div>
          <div class="form_input_notice">
              <p class="d-none" id="prio-validation">Select a Priority</p>
          </div>
      </div>
  `;
}
