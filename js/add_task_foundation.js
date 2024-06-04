let statusVar;
let taskIndex;

/**
 * Deletes the user array, saves the empty list, and reloads the users.
 *
 * This function sets the `users` array to an empty list, asynchronously stores it
 * under the key "users", and then reloads the user list.
 *
 * @async
 * @function deleteUserArray
 * @returns {Promise<void>} A promise that resolves when the user list is successfully deleted and reloaded.
 * @throws {Error} If there is an error saving or loading the users.
 */
async function deleteUserArray() {
      users = [];
      await setItem("users", JSON.stringify(users)); 
      await loadUsers();
}


/**
 * Initializes the process of adding a task.
 *
 * This function sets the current task priority, loads tasks from remote storage,
 * loads login data, adds the tasks, updates the task index, and updates the top bar.
 *
 * @async
 * @function initAddTask
 * @returns {Promise<void>} A promise that resolves when the task addition process is complete.
 * @throws {Error} If there is an error loading tasks, loading login data, or adding tasks.
 */
async function initAddTask() {
      currentPriority = 2;
      await loadTasksToAddTasksFromRemoteStorage();
      await loadLoginData();
      addToTasks();
      taskIndex = tasks.length - 1;
      putInitialInTopBar();
}


/**
 * Loads tasks to be added from remote storage.
 *
 * This function retrieves the tasks stored under the key "tasks" from remote storage,
 * parses them as JSON, and assigns them to the `tasks` variable. If an error occurs
 * during the loading process, it logs the error to the console.
 *
 * @async
 * @function loadTasksToAddTasksFromRemoteStorage
 * @returns {Promise<void>} A promise that resolves when the tasks are successfully loaded and parsed.
 * @throws {Error} If there is an error retrieving or parsing the tasks.
 */
async function loadTasksToAddTasksFromRemoteStorage() {
      try {
            tasks = JSON.parse(await getItem("tasks"));
      } catch (e) {
            console.error("Loading error:", e);
      }
}


/**
 * Adds a new task object to the tasks array.
 *
 * This function creates a new task object with default properties and
 * pushes it to the `tasks` array. Each property is initialized to an
 * empty array or a default value.
 *
 * @function addToTasks
 */
function addToTasks() {
      tasks.push({
            assigned: [],
            category: [],
            date: [],
            description: [],
            id: [],
            initials: [],
            priority: ['Medium'],
            status: [],
            subtasks: [],
            title: []
      });
}


/**
 * Filters the accounts to assign based on the search input.
 *
 * This function retrieves the value from the search input element, converts it to lowercase,
 * and clears the current list of accounts to assign. It then calls a function to display
 * the filtered accounts in the dropdown.
 *
 * @function filterAccountsToAssign
 */
function filterAccountsToAssign() {
      let search = document.getElementById("search_accounts_to_assign").value;
      search = search.toLowerCase();
      let assign = document.getElementById("assign_list");
      assign.innerHTML = "";
      displayAccountsInAssignDropdown(search, assign);
}


/**
 * Copies users to accounts and ensures no duplicates, then adds colors and copies contacts.
 *
 * This function loads users and contacts, then iterates through the `users` array,
 * adding users to the `accounts` array if they are not already present. It includes
 * the user's ID, username, and email, and assigns a type of "Account". After that,
 * it adds colors to accounts and copies contacts to accounts.
 *
 * @async
 * @function copyUsersToAccounts
 * @returns {Promise<void>} A promise that resolves when the process of copying users to accounts, 
 * adding colors, and copying contacts is complete.
 * @throws {Error} If there is an error during any of the asynchronous operations.
 */
async function copyUsersToAccounts() {
      await loadUsers();
      await loadContactsOnAddTask();
      users.forEach(user => {
            if (!accounts.some(account => account.name === user.username)) {
                  accounts.push({
                        id: user.id,
                        name: user.username,
                        email: user.email, // Adding the email address from `users`
                        type: "Account"
                  });
            }
      });
      await addColorsToAccounts();
      await copyContactsToAccounts();
}


/**
 * Copies contacts to accounts, removes outdated contacts.
 *
 * This function ensures that the `accounts` array is updated to include all contacts from `userContacts`.
 * It removes any accounts marked as "Contact" that no longer exist in `userContacts`, adds new contacts.
 *
 * @async
 * @function updateAccountsFromContacts
 * @returns {Promise<void>} A promise that resolves when the process of copying contacts and updating accounts is complete.
 * @throws {Error} If there is an error during any of the asynchronous operations.
 */
async function updateAccountsFromContacts() {
      const existingContactNames = userContacts.map(contact => contact.name);
      const accountsToRemove = accounts.filter(account => account.type === "Contact" && !existingContactNames.includes(account.name));
      accounts = accounts.filter(account => !accountsToRemove.includes(account));
      userContacts.forEach(contact => {
          if (!accounts.some(account => account.name === contact.name)) {
              accounts.push({
                  id: contact.id,
                  name: contact.name,
                  email: contact.mail, // Adding the email address from 'userContacts'
                  phone: contact.phone,
                  type: "Contact"
              });
          }
      });
      accounts.sort((a, b) => a.name.localeCompare(b.name, 'de', { sensitivity: 'base' }));
  }
  

  /**
   * Updates account information and adds colors to the accounts.
   *
   * This function ensures that each account has initials derived from their name. Finally, it sorts the accounts
   * by name and adds colors to the accounts.
   *
   * @async
   * @function updateAccountDetails
   * @returns {Promise<void>} A promise that resolves when the process of updating account details and adding colors is complete.
   * @throws {Error} If there is an error during any of the asynchronous operations.
   */
  async function updateAccountDetails() {
      accounts = accounts.map(account => {
          const initials = account.name.split(' ').map(part => part[0]).join('');
          return { ...account, initials };
      });
      await addColorsToAccounts();
  }

  
  /**
   * Copies contacts to accounts, removes outdated contacts, and updates account information.
   *
   * This function ensures that the `accounts` array is updated to include all contacts from `userContacts`.
   * It removes any accounts marked as "Contact" that no longer exist in `userContacts`, adds new contacts,
   * and ensures that each account has initials derived from their name. Finally, it sorts the accounts
   * by name and adds colors to the accounts.
   *
   * @async
   * @function copyContactsToAccounts
   * @returns {Promise<void>} A promise that resolves when the process of copying contacts, updating accounts,
   * and adding colors is complete.
   * @throws {Error} If there is an error during any of the asynchronous operations.
   */
  async function copyContactsToAccounts() {
      await updateAccountsFromContacts();
      await updateAccountDetails();
  }


const hex_colors = [
      '#E6194B', '#3CB44B', '#E0C112', '#4363D8', '#F58231',
      '#911EB4', '#46F0F0', '#F032E6', '#BCF60C', '#FAA0BE',
      '#008080', '#E6BEFF', '#9A6324', '#F0E68C', '#800000',
      '#AAFFC3', '#808000', '#FFD8B1', '#000075',
      '#469990', '#fabebe', '#e6beff', '#9A6324', '#F0E68C',
      '#800000', '#aaffc3', '#808000', '#ffd8b1', '#000075',
      '#ff69b4', '#1e90ff'
];


/**
 * Adds colors to accounts based on their ID.
 *
 * This function maps over the `accounts` array and assigns a color to each account
 * based on its ID. The color is chosen from the `hex_colors` array using the account's
 * ID modulo the length of the `hex_colors` array.
 *
 * @async
 * @function addColorsToAccounts
 * @returns {Promise<void>} A promise that resolves when the colors have been successfully added to the accounts.
 * @throws {Error} If there is an error during the color assignment process.
 */
async function addColorsToAccounts() {
      accounts = accounts.map(account => {
            // Use the account's `id` for color assignment
            const colorIndex = account.id % hex_colors.length;
            return { ...account, color: hex_colors[colorIndex] };
      });
}

    
/**
 * Displays accounts in the assignment dropdown based on the search query.
 *
 * This function iterates over the `accounts` array and displays accounts in the
 * assignment dropdown if their name includes the search query. It also handles
 * the display of an error message if no results are found.
 *
 * @function displayAccountsInAssignDropdown
 * @param {string} search - The search query to filter accounts by name.
 * @param {HTMLElement} assign - The dropdown element where the filtered accounts will be displayed.
 */
function displayAccountsInAssignDropdown(search, assign) {
      for (let i = 0; i < accounts.length; i++) {
            const accountId = accounts[i]['id'];
            const assignedIds = tasks[taskIndex]['id'];
            const accountName = accounts[i]['name'];
            if (document.getElementById("form_assign_error")) {
                  document.getElementById("form_assign_error").remove();
            }
            if (accountName.toLowerCase().includes(search)) {
                  setStateOfAccountInAssignDropdown(assign, i, accountId, assignedIds);
            }
            if (search.length >= 1 && assign.childElementCount === 0 && !accountName.toLowerCase().includes(search)) {
                  displayErrorIfNoResultsInAccountsToAssign(assign);
            }
      }
}


/**
 * Displays an error message in the assignment dropdown if no results are found.
 *
 * This function updates the inner HTML of the assignment dropdown to show an error
 * message indicating that no results were found and prompts the user to modify their search.
 *
 * @function displayErrorIfNoResultsInAccountsToAssign
 * @param {HTMLElement} assign - The dropdown element where the error message will be displayed.
 */
function displayErrorIfNoResultsInAccountsToAssign(assign) {
      assign.innerHTML = /*html*/`
      <li class="assign_li" id="form_assign_error"><div class="form_assign_name form_assign_error">No results. Please modify your search. </div></li>
      `;
}


/**
 * Sets the state of an account in the assignment dropdown based on its assignment status.
 *
 * This function checks if the account with the given ID is included in the assigned IDs for the current task.
 * If the account is not assigned, it calls a function to handle that state. If the account is assigned,
 * it calls a different function to handle that state.
 *
 * @function setStateOfAccountInAssignDropdown
 * @param {HTMLElement} assign - The dropdown element where the account state will be displayed.
 * @param {number} i - The index of the account in the accounts array.
 * @param {number} accountId - The ID of the account to check.
 * @param {Array<number>} assignedIds - An array of IDs representing the accounts assigned to the current task.
 */
function setStateOfAccountInAssignDropdown(assign, i, accountId, assignedIds) {
      /* If the account i is NOT assigned to the task, this should be executed */
      if (!assignedIds.includes(accountId)) {
            accountIdnotIncludesAssignId(assign, i, accountId, assignedIds);
      }
      /* If the account i is assigned to the task, this should be executed */
      if (assignedIds.includes(accountId)) {
            accountIdIncludesAssignId(assign, i, accountId, assignedIds);
      }
}


/**
 * Checks if an account is assigned to the current task and updates the UI accordingly.
 *
 * This function checks if the account with the given index is assigned to the current task.
 * It retrieves the account's ID and name, checks the assigned IDs and assigned names in the current task,
 * and updates the UI based on whether the account is assigned or not. If the task is being edited,
 * it also loads the assigned badges for editing.
 *
 * @function checkIfAssigned
 * @param {number} i - The index of the account in the accounts array.
 */
function checkIfAssigned(i) {
      const accountId = accounts[i]['id'];
      const assignedIds = tasks[taskIndex]['id'];
      const accountName = `${accounts[i]['name']}`;
      const index = tasks[taskIndex]['assigned'].indexOf(accountName);
      let badge = document.getElementById('form_assign_badge');
      let assignbadge = document.getElementById(`assign_badge${i}`);
      ifAccountIsNotAssigned(i, accountId, assignedIds, badge, index, assignbadge);
      if (editTask == true) {
            loadAssignedBadgesInEditTask(task);  
      }
}


/**
 * Updates the task assignment status of an account.
 *
 * This function checks if the account with the given ID is not assigned to the current task.
 * If not, it assigns the account to the task by updating the assigned names, initials, and IDs.
 *
 * @function updateTaskAssignment
 * @param {number} i - The index of the account in the accounts array.
 * @param {number} accountId - The ID of the account to check.
 * @param {Array<number>} assignedIds - An array of IDs representing the accounts assigned to the current task.
 * @param {HTMLElement} badge - The badge element where the assigned account's initials will be displayed.
 */
function updateTaskAssignment(i, accountId, assignedIds, badge) {
      if (!assignedIds.includes(accountId)) {
          tasks[taskIndex]['assigned'].push(accounts[i]['name']);
          tasks[taskIndex]['initials'].push(accounts[i]['initials']);
          tasks[taskIndex]['id'].push(accountId);
          badge.innerHTML += /*html*/`
              <div id="assign_badge_below${i}" class="form_assign_badge" style="background-color: ${accounts[i].color};">${accounts[i]['initials']}</div>
          `;
      }
  }
  

  /**
   * Removes the task assignment of an account and updates the UI accordingly.
   *
   * This function removes the account assignment from the current task and updates the UI
   * by removing the corresponding badges.
   *
   * @function removeTaskAssignment
   * @param {number} i - The index of the account in the accounts array.
   * @param {number} index - The index of the account name in the task's assigned array.
   * @param {HTMLElement} assignbadge - The badge element for the assigned account.
   */
  function removeTaskAssignment(i, index, assignbadge) {
      if (index !== -1) {
          tasks[taskIndex]['assigned'].splice(index, 1);
          tasks[taskIndex]['id'].splice(index, 1);
          tasks[taskIndex]['initials'].splice(index, 1);
          assignbadge.remove();
          if (window.location.pathname === '/add-task-page.html') {
              let badgeBelow = document.getElementById(`assign_badge_below${i}`);
              if (badgeBelow) {
                  badgeBelow.remove();
              }
          }
      }
  }
  