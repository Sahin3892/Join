/**
 * Displays the initials badges for assigned users on the Kanban board.
 *
 * This function retrieves the initials and color IDs of the users assigned to a task,
 * then displays these initials as badges with corresponding background colors on the Kanban board.
 * If there are more than 7 assigned users, a counter badge is displayed instead.
 *
 * @function getAssignBadgesInitials
 * @param {number} i - The index of the task in the tasks array.
 */
function getAssignBadgesInitials(i) {
  let initials = tasks[i].initials;
  let colorId = tasks[i].id;
  let assignedTo = document.getElementById(`kanban-assign-to-${i}`);
  assignedTo.innerHTML = ``;

  for (let j = 0; j < initials.length; j++) {
    const initial = initials[j];
    const color = colorId[j];
    if (j < 7) {
      const accountWithColorId = accounts.find(account => account.id === color);
      const colorValue = accountWithColorId ? accountWithColorId.color : 'Nicht gefunden';
      assignedTo.innerHTML += /*html*/ `
        <div class="kanban-assign-badge" style="background-color: ${colorValue};">${initial}</div> 
      `;
    }
    if (j === 7) {
      assignedTo.innerHTML += /*html*/ `
        <div class="kanban-assign-badge" id="badge-counter-${i}" style="background-color: #000000;">+${j-7}</div> 
      `;
    }
    if (j > 7) {
      let badge = document.getElementById(`badge-counter-${i}`);
      badge.innerHTML = `+${j-7}`;
    }
  }
}


/**
 * Updates the initials badges for assigned users on the Kanban board.
 *
 * This function retrieves the initials and color IDs of the users assigned to a task,
 * then displays these initials as badges with corresponding background colors on the Kanban board.
 * If there are more than 7 assigned users, a counter badge is displayed instead.
 *
 * @function updateAssignBadgesInitials
 * @param {number} i - The index of the task in the tasks array.
 */
function updateAssignBadgesInitials(i) {
  let initials = tasks[i].initials;
  let colorId = tasks[i].id;
  let assignedTo = document.getElementById(`kanban-assign-to-${i}`);
  assignedTo.innerHTML = ``;

  for (let j = 0; j < initials.length; j++) {
    if (j < 7) {
      addInitialBadge(assignedTo, initials[j], colorId[j]);
    } else {
      updateBadgeCounter(i, j - 7);
      break;
    }
  }
}


/**
 * Adds an initial badge to the Kanban board.
 *
 * This function creates a badge with the user's initials and corresponding background color.
 *
 * @function addInitialBadge
 * @param {HTMLElement} assignedTo - The element where the badge will be added.
 * @param {string} initial - The initial to be displayed on the badge.
 * @param {number} colorId - The ID used to find the corresponding color.
 */
function addInitialBadge(assignedTo, initial, colorId) {
  const accountWithColorId = accounts.find(account => account.id === colorId);
  const colorValue = accountWithColorId ? accountWithColorId.color : 'Nicht gefunden';
  assignedTo.innerHTML += /*html*/ `
    <div class="kanban-assign-badge" style="background-color: ${colorValue};">${initial}</div> 
  `;
}


/**
 * Updates the counter badge when there are more than 7 assigned users.
 *
 * This function creates or updates a badge that shows the number of additional assigned users.
 *
 * @function updateBadgeCounter
 * @param {number} i - The index of the task in the tasks array.
 * @param {number} count - The number of additional assigned users.
 */
function updateBadgeCounter(i, count) {
  let badge = document.getElementById(`badge-counter-${i}`);
  if (!badge) {
    const assignedTo = document.getElementById(`kanban-assign-to-${i}`);
    assignedTo.innerHTML += /*html*/ `
      <div class="kanban-assign-badge" id="badge-counter-${i}" style="background-color: #000000;">+${count}</div> 
    `;
  } else {
    badge.innerHTML = `+${count}`;
  }
}

 
/**
 * Tilts a Kanban card to indicate interaction.
 *
 * This function adds a 'tilt' class to the specified Kanban card to visually indicate interaction.
 *
 * @function tiltCard
 * @param {number} i - The index of the Kanban card in the tasks array.
 */
function tiltCard(i) {
  let card = document.getElementById(`kanban-card-${i}`);
  card.classList.add('tilt');
}


/**
* Resets the tilt of a Kanban card.
*
* This function removes the 'tilt' class from the specified Kanban card to reset its appearance.
*
* @function resetCard
* @param {number} i - The index of the Kanban card in the tasks array.
*/
function resetCard(i) {
  let card = document.getElementById(`kanban-card-${i}`);
  card.classList.remove('tilt');
}

let currentDraggedElement;

/**
* Allows a drop event on a Kanban column.
*
* This function prevents the default handling of the drop event to allow elements to be dropped.
*
* @function allowDrop
* @param {Event} event - The drop event.
*/
function allowDrop(event) {
  event.preventDefault();
}


/**
* Starts dragging a Kanban card.
*
* This function sets the index of the current dragged element.
*
* @function startDragging
* @param {number} i - The index of the Kanban card being dragged.
*/
function startDragging(i) {
  currentDraggedElement = i;
}


/**
* Drops a Kanban card into a specified column.
*
* This asynchronous function handles the drop event, moves the Kanban card to the target column,
* updates the task's status, and saves the changes.
*
* @async
* @function dropIntoColumn
* @param {Event} ev - The drop event.
* @param {string} columnId - The ID of the target column.
*/
async function dropIntoColumn(ev, columnId) {
  ev.preventDefault();
  const i = currentDraggedElement;
  const kanbanCard = document.getElementById(`kanban-card-${i}`);
  const targetColumn = document.getElementById(columnId);
  if (kanbanCard && targetColumn) {
      deleteNoTasksStatus(columnId);
      kanbanCard.remove(); // Remove the element from its original container
      targetColumn.appendChild(kanbanCard); // Add it to the target container
      await moveTo(columnId);
  }
}


/**
* Adds a highlight to a drop column.
*
* This function adds a 'highlight-column' class to the specified column to visually indicate it as a drop target.
*
* @function addHighlightDropColumn
* @param {string} column - The ID of the column to highlight.
*/
function addHighlightDropColumn(column) {
  document.getElementById(`${column}`).classList.add('highlight-column');
}


/**
* Removes the highlight from a drop column.
*
* This function removes the 'highlight-column' class from the specified column to reset its appearance.
*
* @function removeHighlightDropColumn
* @param {string} column - The ID of the column to remove the highlight from.
*/
function removeHighlightDropColumn(column) {
  document.getElementById(`${column}`).classList.remove('highlight-column');
}


/**
* Moves a task to a specified status and saves the changes.
*
* This asynchronous function updates the status of the current dragged task,
* saves the changes to remote storage, and re-renders all tasks on the Kanban board.
*
* @async
* @function moveTo
* @param {string} status - The new status of the task.
*/
async function moveTo(status) {
  tasks[currentDraggedElement].status = status; // Change "status" to "category" if it's the correct property.
  await saveTaskToRemoteStorageFromBoard();
  await initRenderAllTasksOnKanban();
}


/**
* Filters tasks based on a search input.
*
* This function filters tasks on the Kanban board based on the search input value,
* showing only the tasks that match the search criteria.
*
* @function filterTasks
*/
function filterTasks() {
  let search = document.getElementById('search-input').value;
  search = search.toLowerCase();
  for (let j = 0; j < tasks.length; j++) {
      let kanbanCard = document.getElementById(`kanban-card-${j}`);
      let taskTitle = tasks[j].title.toString();
      let taskDescription = tasks[j].description.toString();
      if (taskTitle.toLowerCase().includes(search) || taskDescription.toLowerCase().includes(search)) {
          kanbanCard.classList.remove('d-none');
      } else {
          kanbanCard.classList.add('d-none');
      }
  }
}


/**
* Deletes the 'no tasks' status from a column.
*
* This function removes all elements with the class 'notasks' from the specified column.
*
* @function deleteNoTasksStatus
* @param {string} columnId - The ID of the column to clear the 'no tasks' status from.
*/
function deleteNoTasksStatus(columnId) {
  const targetColumn = document.getElementById(columnId);
  const elementsToRemove = targetColumn.querySelectorAll('.notasks');
  elementsToRemove.forEach(function (element) {
      element.remove();
  });
}
 
 let autoScrollInterval;
 const scrollContainer = document.getElementById('to-do-column');

/**
 * Adds event listeners to all draggable items for drag start and drag end events.
 *
 * This function selects all elements with the class 'draggable' and adds event listeners
 * for 'dragstart' and 'dragend' events.
 */
document.querySelectorAll('.draggable').forEach(item => {
  item.addEventListener('dragstart', handleDragStart, false);
  item.addEventListener('dragend', handleDragEnd, false);
});


/**
* Checks if the current page is /board.html and adds a drag over event listener to the scroll container.
*/
if (window.location.pathname === '/board.html') {
  // Adds the event listener
  scrollContainer.addEventListener('dragover', handleDragOver, false);
}


/**
* Handles the drag start event.
*
* This function sets the opacity of the dragged element to 0.4.
*
* @function handleDragStart
* @param {Event} e - The drag start event.
*/
function handleDragStart(e) {
  this.style.opacity = '0.4';
}


/**
* Handles the drag over event.
*
* This function prevents the default handling of the drag over event.
*
* @function handleDragOver
* @param {Event} e - The drag over event.
*/
function handleDragOver(e) {
  e.preventDefault();
}


/**
* Handles the drag end event.
*
* This function resets the opacity of the dragged element to 1.
*
* @function handleDragEnd
* @param {Event} e - The drag end event.
*/
function handleDragEnd(e) {
  this.style.opacity = '1';
}


/**
* Starts auto-scrolling the scroll container.
*
* This function starts auto-scrolling the scroll container at the specified speed.
*
* @function startAutoScroll
* @param {number} speed - The speed at which to scroll the container.
*/
function startAutoScroll(speed) {
  stopAutoScroll();
  autoScrollInterval = setInterval(() => {
      scrollContainer.scrollLeft += speed;
  }, 20);
}


/**
* Stops auto-scrolling the scroll container.
*
* This function stops the auto-scrolling of the scroll container.
*
* @function stopAutoScroll
*/
function stopAutoScroll() {
  clearInterval(autoScrollInterval);
}


/**
* Clamps text content to a specified number of lines.
*
* This function truncates the text content of elements matching the selector to fit within
* the specified number of lines, adding an ellipsis if the text overflows.
*
* @function clampText
* @param {string} selector - The selector for the elements to clamp text.
* @param {number} maxLines - The maximum number of lines allowed.
*/
function clampText(selector, maxLines) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(el => {
      const lineHeight = parseInt(window.getComputedStyle(el).lineHeight);
      const maxHeight = lineHeight * maxLines;
      if (el.scrollHeight > maxHeight) {
          let text = el.innerText;
          while (el.scrollHeight > maxHeight) {
              text = text.substr(0, text.length - 1);
              el.innerText = text + '...';
          }
      }
  });
}


/**
* Adds ellipsis to text content that exceeds a specified number of lines.
*
* This function truncates the text content of elements matching the selector to fit within
* the specified number of lines, adding an ellipsis if the text overflows.
*
* @function addEllipsisToElements
* @param {string} selector - The selector for the elements to add ellipsis.
* @param {number} maxLines - The maximum number of lines allowed.
*/
function addEllipsisToElements(selector, maxLines) {
  const elements = document.querySelectorAll(selector);
  elements.forEach(element => {
      const lineHeight = parseInt(window.getComputedStyle(element).lineHeight, 10);
      const maxHeight = lineHeight * maxLines;

      let text = element.innerText;
      while (element.scrollHeight > maxHeight && text.length > 0) {
          text = text.slice(0, -1);
          element.innerText = text + '...';
      }
  });
}


/**
* Activates event listeners and applies ellipsis to Kanban descriptions.
*
* This asynchronous function applies ellipsis to Kanban descriptions that exceed a specified number of lines.
*
* @async
* @function activateEventListeners
*/
async function activateEventListeners() {
  addEllipsisToElements('.kanban-description', 4); // Assuming 4 lines is the maximum
}
