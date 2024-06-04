/**
 * Shows the new contact form.
 *
 * This function sets the display property of the new contact form to "flex".
 *
 * @function addNewContact
 */
function addNewContact() {
   document.getElementById("newContactForm").style.display = "flex";
}


/**
* Closes the new contact form.
*
* This function hides the new contact form and clears the input fields.
*
* @function closeForm
*/
function closeForm() {
   document.getElementById("newContactForm").style.display = "none";
   document.getElementById("contactFormOverlay").style.display = "none";
   document.getElementById("name").value = "";
   document.getElementById("email").value = "";
   document.getElementById("phone").value = "";
   document.getElementById("edit-name").value = "";
   document.getElementById("edit-email").value = "";
   document.getElementById("edit-phone").value = "";
   closeContactDetailsMobile();
}


/**
* Capitalizes the first letter of a string.
*
* This function capitalizes the first letter and lowercases the rest of the string.
*
* @function capitalizeFirstLetter
* @param {string} string - The string to capitalize.
* @returns {string} The capitalized string.
*/
function capitalizeFirstLetter(string) {
   return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


/**
* Formats a name by capitalizing the first letter of each word.
*
* This function splits the name into words, capitalizes each word, and joins them back together.
*
* @function formatName
* @param {string} name
* @param {string} name - The name to format.
* @returns {string} The formatted name.
*/
function formatName(name) {
   return name.split(' ').map(capitalizeFirstLetter).join(' ');
}


/**
* Saves a new contact.
*
* This asynchronous function creates a new contact, adds it to the userContacts array,
* saves it to storage, and resets the form.
*
* @async
* @function saveNewContact
* @returns {Promise<void>} A promise that resolves when the contact is saved.
*/
async function saveNewContact() {
   const newContact = createNewContact();
   userContacts.push(newContact);
   await setItem('userContacts', JSON.stringify(userContacts));
   await resetFormAndRefresh();
}


/**
* Creates a new contact object.
*
* This function retrieves input values from the form, formats the name,
* and returns a new contact object with a unique ID.
*
* @function createNewContact
* @returns {Object} The new contact object.
*/
function createNewContact() {
   let nameInput = document.getElementById("name").value;
   const email = document.getElementById("email").value;
   const phone = document.getElementById("phone").value;
   const name = formatName(nameInput);
   let maxId = accounts.reduce((max, { id }) => Math.max(max, id), 0);
   return {
       id: ++maxId,
       name: name,
       mail: email,
       phone: phone,
   };
}


/**
* Resets the form and refreshes the contact list.
*
* This asynchronous function clears the form input fields, updates the accounts,
* renders the contacts, and closes the form.
*
* @async
* @function resetFormAndRefresh
* @returns {Promise<void>} A promise that resolves when the form is reset and contacts are refreshed.
*/
async function resetFormAndRefresh() {
   document.getElementById("name").value = "";
   document.getElementById("email").value = "";
   document.getElementById("phone").value = "";
   await copyUsersToAccounts();
   renderContacts();
   closeForm();
}


/**
* Loads contacts from storage and renders them.
*
* This asynchronous function retrieves stored contacts, parses them, and renders them.
*
* @async
* @function loadContacts
* @returns {Promise<void>} A promise that resolves when contacts are loaded and rendered.
*/
async function loadContacts() {
   try {
       const storedContacts = await getItem('userContacts'); 
       if (storedContacts) {
           userContacts = JSON.parse(storedContacts); 
           renderContacts(); 
       }
   } catch (error) {
       console.error('Fehler beim Laden der Kontakte:', error); 
   }
}


/**
* Loads contacts for adding to a task.
*
* This asynchronous function retrieves stored contacts and parses them.
*
* @async
* @function loadContactsOnAddTask
* @returns {Promise<void>} A promise that resolves when contacts are loaded.
*/
async function loadContactsOnAddTask() {
   try {
       const storedContacts = await getItem('userContacts'); 
       if (storedContacts) {
           userContacts = JSON.parse(storedContacts); 
       }
   } catch (error) {
       console.error('Fehler beim Laden der Kontakte:', error); 
   }
}


/**
* Deletes a contact by name.
*
* This asynchronous function finds a contact by name, updates tasks for the deleted contact,
* removes the contact, and handles the deletion result.
*
* @async
* @function deleteContact
* @param {string} contactName - The name of the contact to delete.
* @returns {Promise<void>} A promise that resolves when the contact is deleted.
*/
async function deleteContact(contactName) {
   try {
       let contactsArray = await getContactsArray();
       let contactIndex = findContactIndex(contactsArray, contactName);
       if (contactIndex !== -1) {
           await updateTasksForDeletedContact(contactName);
           await removeContact(contactsArray, contactIndex);
           handleDeletionResult(contactsArray);
       } else {
           console.log("Kontakt nicht gefunden");
       }
   } catch (error) {
       console.error('Fehler beim Löschen des Kontakts:', error);
   }
}


/**
* Retrieves the contacts array from storage.
*
* @async
* @function getContactsArray
* @returns {Promise<Array<Object>>} A promise that resolves to the array of contacts.
*/
async function getContactsArray() {
   return JSON.parse(await getItem('userContacts'));
}


/**
* Finds the index of a contact by name.
*
* @function findContactIndex
* @param {Array<Object>} contactsArray - The array of contacts.
* @param {string} contactName - The name of the contact to find.
* @returns {number} The index of the contact, or -1 if not found.
*/
function findContactIndex(contactsArray, contactName) {
   return contactsArray.findIndex(contact => contact.name === contactName);
}


/**
* Updates tasks for a deleted contact.
*
* This asynchronous function removes the contact from all tasks it is assigned to.
*
* @async
* @function updateTasksForDeletedContact
* @param {string} contactName - The name of the contact to remove from tasks.
* @returns {Promise<void>} A promise that resolves when tasks are updated.
*/
async function updateTasksForDeletedContact(contactName) {
   tasks.forEach(task => {
       let assignedIndex = task.assigned.findIndex(name => name === contactName);
       if (assignedIndex !== -1) {
           task.assigned.splice(assignedIndex, 1);
           task.id.splice(assignedIndex, 1);
           task.initials.splice(assignedIndex, 1);
       }
   });
   await saveTaskToRemoteStorageFromBoard();
}


/**
* Removes a contact from the contacts array.
*
* This asynchronous function removes the contact at the specified index from the contacts array and saves the updated array.
*
* @async
* @function removeContact
* @param {Array<Object>} contactsArray - The array of contacts.
* @param {number} contactIndex - The index of the contact to remove.
* @returns {Promise<void>} A promise that resolves when the contact is removed.
*/
async function removeContact(contactsArray, contactIndex) {
   contactsArray.splice(contactIndex, 1);
   await setItem('userContacts', JSON.stringify(contactsArray));
}


/**
* Handles the result of a contact deletion.
*
* This function updates the global userContacts array, renders contacts, and closes the contact details.
*
* @function handleDeletionResult
* @param {Array<Object>} contactsArray - The updated array of contacts.
*/
function handleDeletionResult(contactsArray) {
   window.userContacts = contactsArray;
   renderContacts();
   closeContactDetails();
}


/**
* Closes the contact details view.
*
* This function clears the inner HTML of the contact details container.
*
* @function closeContactDetails
*/
function closeContactDetails() {
   const contactDetailsContainer = document.getElementById("contact-details");
   contactDetailsContainer.innerHTML = '';
}


/**
* Deletes all contacts.
*
* This asynchronous function clears the userContacts array and updates the storage.
*
* @async
* @function deleteAllContacts
* @returns {Promise<void>} A promise that resolves when all contacts are deleted.
*/
async function deleteAllContacts() {
   userContacts = [];
   localStorage.setItem('userContacts', JSON.stringify(userContacts));
   await setItem('userContacts', JSON.stringify(userContacts));
}


/**
* Validates the contact form.
*
* This function always returns true.
*
* @function validateForm
* @returns {boolean} Always returns true.
*/
function validateForm() {
   return true;
}


/**
* Hides the add contact form.
*
* This asynchronous function sets the display property of the add contact form to "none".
*
* @async
* @function hideAddContactForm
* @returns {Promise<void>} A promise that resolves when the form is hidden.
*/
async function hideAddContactForm() {
   document.getElementById("newContactForm").style.display = "none";
}
