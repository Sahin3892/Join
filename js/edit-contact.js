let currentContactId;

/**
 * Edits a contact by ID.
 *
 * This asynchronous function finds the contact by ID, sets the current contact ID,
 * opens the edit contact form, populates the form with contact details, and updates the contact visuals.
 *
 * @async
 * @function editContact
 * @param {number} contactId - The ID of the contact to edit.
 * @returns {Promise<void>} A promise that resolves when the contact is edited.
 */
async function editContact(contactId) {
    const contact = findContactById(contactId);
    currentContactId = contactId;
    if (contact) {
        await openEditContactForm();
        populateEditForm(contact);
    } else {
        console.log("Kontakt nicht gefunden.");
    }
    updateContactVisuals(contactId);
}


/**
 * Finds a contact by ID.
 *
 * This function searches the userContacts array and returns the contact with the matching ID.
 *
 * @function findContactById
 * @param {number} contactId - The ID of the contact to find.
 * @returns {Object} The contact object with the matching ID, or undefined if not found.
 */
function findContactById(contactId) {
    return userContacts.find(contact => contact.id === contactId);
}


/**
 * Populates the edit form with contact details.
 *
 * This function sets the values of the edit form fields with the provided contact's details.
 *
 * @function populateEditForm
 * @param {Object} contact - The contact object with details to populate the form.
 */
function populateEditForm(contact) {
    let name = contact.name;
    let email = contact.mail;
    let phone = contact.phone || 'Keine Telefonnummer';
    document.getElementById('edit-name').value = name;
    document.getElementById('edit-email').value = email;
    document.getElementById('edit-phone').value = phone;
}


/**
 * Updates the contact visuals in the edit form.
 *
 * This function sets the background color and initials for the contact's visual representation in the edit form.
 *
 * @function updateContactVisuals
 * @param {number} contactId - The ID of the contact to update visuals for.
 */
function updateContactVisuals(contactId) {
    let initials = document.getElementById('edit-img');
    let overlay = document.getElementById('overlay-img-div');
    const account = accounts.find(account => account.id === contactId);
    let color = account.color;
    let ini = account.initials;
    initials.style.background = color;
    overlay.innerHTML = `<div id="edit-img" class="edit-contact-initials" src="" style="background: ${color};">${ini}</div>`;
}


/**
 * Opens the edit contact form.
 *
 * This asynchronous function displays the edit contact form overlay and adds an event listener to close the form when clicking outside.
 *
 * @async
 * @function openEditContactForm
 * @returns {Promise<void>} A promise that resolves when the edit contact form is opened.
 */
async function openEditContactForm() {
    document.getElementById("contactFormOverlay").style.display = "flex"; // Show the overlay form
    document.getElementById('contactFormOverlay').addEventListener('click', function (event) {
        if (event.target === this) {
            closeForm();  // Use the existing closeForm function to close the modal
        }
    });
}


/**
 * Saves the edited contact details.
 *
 * This asynchronous function updates the contact details with the values from the edit form,
 * saves the updated contact to storage, closes the form, and re-renders the contacts.
 *
 * @async
 * @function saveEditedContact
 * @returns {Promise<void>} A promise that resolves when the contact is saved.
 */
async function saveEditedContact() {
    let contact = userContacts.find(contact => contact.id === currentContactId);
    if (contact) {
        contact.name = document.getElementById('edit-name').value;
        contact.mail = document.getElementById('edit-email').value;
        contact.phone = document.getElementById('edit-phone').value;
    } else {
        console.log("Kontakt mit der ID " + currentContactId + " wurde nicht gefunden.");
    }
    await saveEditedContactToStorage();
    closeForm();
    renderContacts();
}


/**
 * Saves the edited contact details to storage.
 *
 * This asynchronous function updates the userContacts array in storage.
 *
 * @async
 * @function saveEditedContactToStorage
 * @returns {Promise<void>} A promise that resolves when the contact is saved to storage.
 */
async function saveEditedContactToStorage() {
    await setItem('userContacts', JSON.stringify(userContacts));
};
