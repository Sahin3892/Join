/**
 * Ensures userContacts array is initialized.
 *
 * This code checks if the userContacts array is undefined and initializes it if necessary.
 */
if (!userContacts) {
    var userContacts = [];
}


/**
 * Adds an event listener to execute after the DOM content is loaded.
 *
 * This function checks the current page URL and includes HTML content if the page is 'contact.html'.
 */
document.addEventListener("DOMContentLoaded", function () {
    if (window.location.pathname === '/contact.html') {
        includeHTML();
    }
});


/**
 * Renders contacts on the page.
 *
 * This asynchronous function shows the contact header, initializes contacts, sets up the contacts container,
 * filters and sorts contacts, and renders them.
 *
 * @async
 * @function renderContacts
 * @returns {Promise<void>} A promise that resolves when contacts are rendered.
 */
async function renderContacts() {
    showContactHeader();
    await initializeContacts();
    const contactsContainer = initializeContactsContainer();
    if (!contactsContainer) return;
    let contactAccounts = filterAndSortContacts();
    renderContactAccounts(contactAccounts, contactsContainer);
}


/**
 * Initializes contacts by copying users to accounts, updating the top bar,
 * and loading tasks from remote storage.
 *
 * @async
 * @function initializeContacts
 * @returns {Promise<void>} A promise that resolves when contacts are initialized.
 */
async function initializeContacts() {
    await copyUsersToAccounts();
    await putInitialInTopBar();
    await loadTaskFromRemoteStorageToBoard();
}


/**
 * Sets up the contacts container element.
 *
 * This function selects the contacts container element by its ID and clears its content.
 * If the element is not found, an error is logged and null is returned.
 *
 * @function initializeContactsContainer
 * @returns {HTMLElement|null} The contacts container element or null if not found.
 */
function initializeContactsContainer() {
    const contactsContainer = document.getElementById("contacts");
    if (!contactsContainer) {
        console.error("Contacts container not found!");
        return null;
    }
    contactsContainer.innerHTML = "";
    return contactsContainer;
}


/**
 * Filters and sorts contact accounts.
 *
 * This function sorts the accounts array alphabetically by name.
 *
 * @function filterAndSortContacts
 * @returns {Array<Object>} The sorted array of contact accounts.
 */
function filterAndSortContacts() {
    let contactAccounts = accounts;
    contactAccounts.sort((a, b) => a.name.localeCompare(b.name));
    return contactAccounts;
}


/**
 * Renders contact accounts in the contacts container.
 *
 * This function iterates over the contact accounts, adds an initial divider for each unique initial,
 * and renders each contact in the container.
 *
 * @function renderContactAccounts
 * @param {Array<Object>} contactAccounts - The array of contact accounts to render.
 * @param {HTMLElement} contactsContainer - The container element to render contacts into.
 */
function renderContactAccounts(contactAccounts, contactsContainer) {
    if (contactAccounts && contactAccounts.length > 0) {
        let currentInitial = ""; // Variable to store the current initial letter.
        for (let i = 0; i < contactAccounts.length; i++) {
            const contact = contactAccounts[i];
            if (contact.name[0].toUpperCase() !== currentInitial) {
                currentInitial = contact.name[0].toUpperCase();
                addInitialDivider(contactsContainer, currentInitial);
            }
            renderContact(contactsContainer, contact);
        }
    } else {
        contactsContainer.innerHTML = "Keine Kontakte gefunden.";
    }
}


/**
 * Loads contacts by copying users to accounts.
 *
 * This asynchronous function ensures that users are copied to accounts when loading contacts.
 *
 * @async
 * @function onLoadContacts
 * @returns {Promise<void>} A promise that resolves when users are copied to accounts.
 */
async function onLoadContacts() {
    await copyUsersToAccounts();
}

/**
 * Displays the contact header.
 *
 * This function sets the inner HTML of the contact details container to show the contact header information.
 *
 * @function showContactHeader
 */
function showContactHeader() {
    const contactDetailsContainer = document.getElementById("contact-details");
    contactDetailsContainer.innerHTML = /*html*/ `          
    <div class="contact-info">
        <div class="contact-headline">
            <span class="contact-Titel-Open">Contacts</span>
            <hr class="contact-hr" />
            <span class="contact-Titel-team">Better with a team</span>
        </div>
    </div>`;
}


/**
 * Opens the selected contact.
 *
 * This function handles the event when a contact is clicked, shows the selected contact details,
 * changes the class to active, and adds an event listener to close the form when clicking outside of it.
 *
 * @function openContact
 * @param {Event} event - The event triggered by clicking a contact.
 */
function openContact(event) {
    const contactElement = event.currentTarget;
    const contactId = contactElement.getAttribute("data-contact-id");
    showSelectedContact(contactId);
    changeClassToActive(contactElement);
    document.getElementById('newContactForm').addEventListener('click', function(event) {
        if (event.target === this) {
            closeForm();  
        }
    });
}


/**
 * Loads contacts by copying users to accounts.
 *
 * This asynchronous function ensures that users are copied to accounts when loading contacts.
 *
 * @async
 * @function onLoadContacts
 * @returns {Promise<void>} A promise that resolves when users are copied to accounts.
 */
async function onLoadContacts() {
    await copyUsersToAccounts();
}


/**
 * Displays the contact header.
 *
 * This function sets the inner HTML of the contact details container to show the contact header information.
 *
 * @function showContactHeader
 */
function showContactHeader() {
    const contactDetailsContainer = document.getElementById("contact-details");
    contactDetailsContainer.innerHTML = /*html*/ `          
    <div class="contact-info">
        <div class="contact-headline">
            <span class="contact-Titel-Open">Contacts</span>
            <hr class="contact-hr" />
            <span class="contact-Titel-team">Better with a team</span>
        </div>
    </div>`;
}


/**
 * Opens the selected contact.
 *
 * This function handles the event when a contact is clicked, shows the selected contact details,
 * changes the class to active, and adds an event listener to close the form when clicking outside of it.
 *
 * @function openContact
 * @param {Event} event - The event triggered by clicking a contact.
 */
function openContact(event) {
    const contactElement = event.currentTarget;
    const contactId = contactElement.getAttribute("data-contact-id");
    showSelectedContact(contactId);
    changeClassToActive(contactElement);
    document.getElementById('newContactForm').addEventListener('click', function(event) {
        if (event.target === this) {
            closeForm();  
        }
    });
}


/**
 * Shows the selected contact's details.
 *
 * This function retrieves the contact by ID, updates the display based on screen width,
 * and renders the contact details.
 *
 * @function showSelectedContact
 * @param {number} contactId - The ID of the contact to show.
 */
function showSelectedContact(contactId) {
    const contact = accounts.find((c) => c.id === parseInt(contactId));
    const contactDetailsContainer = document.getElementById("contact-details");
    if (window.innerWidth <= 820) {
        let details = document.getElementById("contact-details");
        details.style.display = "flex";
        let list = document.getElementById("contact-list-inside");
        list.style.display = "none";
    } else {
        let details = document.getElementById("contact-details");
        details.style.display = "flex";
        let list = document.getElementById("contact-list-inside");
        list.style.display = "flex";
    }
    if (contact) {
        renderContactDetails(contact, contactDetailsContainer);
    }
}


/**
 * Closes the contact details on mobile devices.
 *
 * This function adjusts the display properties based on screen width and renders contacts.
 *
 * @function closeContactDetailsMobile
 */
function closeContactDetailsMobile() {
    if (window.innerWidth <= 820) {
        let list = document.getElementById("contact-list-inside");
        list.style.display = "flex";
        let details = document.getElementById("contact-details");
        details.style.display = "none";
    } else {
        let details = document.getElementById("contact-details");
        details.style.display = "flex";
        let list = document.getElementById("contact-list-inside");
        list.style.display = "flex";
    }
    renderContacts();
}


/**
 * Changes the class of the selected element to active.
 *
 * This function removes the "active" class from all elements and adds it to the specified element.
 *
 * @function changeClassToActive
 * @param {HTMLElement} element - The element to activate.
 */
function changeClassToActive(element) {
    if (!element) {
        console.error("Element is not defined!");
        return;
    }
    const activeElements = document.getElementsByClassName("active");
    for (let i = 0; i < activeElements.length; i++) {
        activeElements[i].classList.remove("active");
    }
    element.classList.add("active");
}

