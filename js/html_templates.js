/**
 * Initializes the page by including HTML content and setting the headline.
 *
 * @async
 * @function init
 * @returns {Promise<void>}
 */
async function init() {
    await includeHTML();
    document.getElementById('headline').innerHTML = 'Hello!';
}


/**
 * Includes HTML content for elements with the "w3-include-html" attribute.
 *
 * This function fetches HTML content from the specified file and inserts it into the element.
 * If the file is not found, it displays an error message.
 *
 * @async
 * @function includeHTML
 * @returns {Promise<void>}
 */
async function includeHTML() {
    let includeElements = document.querySelectorAll('[w3-include-html]');
    for (let i = 0; i < includeElements.length; i++) {
        const element = includeElements[i];
        file = element.getAttribute("w3-include-html"); // "includes/header.html"
        let resp = await fetch(file);
        if (resp.ok) {
            element.innerHTML = await resp.text();
        } else {
            element.innerHTML = 'Page not found';
        }
    }
    highlightCurrentPageInNav();
}


/**
 * Returns an HTML template string with the specified template and element ID.
 *
 * @function getHtmlTemplate
 * @param {string} template - The path to the HTML template file.
 * @param {string} elementID - The ID to be assigned to the HTML element.
 * @returns {string} The HTML template string.
 */
function getHtmlTemplate(template, elementID) {
    return /*html*/`
      <div id=${elementID} w3-include-html=${template}>
    </div>`;
}


/**
 * Displays the top bar menu and sets up event listeners for hiding it on outside click.
 *
 * @async
 * @function showTopBarMenu
 * @returns {Promise<void>}
 */
async function showTopBarMenu() {
    const element = document.getElementById("top-menu");
    element.style.right = "48px";

    setTopBarMenuContent(element);
    await putInitialInTopBar();
    setupOutsideClickListener(element);
}


/**
 * Sets the content of the top bar menu based on the logged-in user status.
 *
 * @function setTopBarMenuContent
 * @param {HTMLElement} element - The top bar menu element.
 */
function setTopBarMenuContent(element) {
    if (loggedInUser === 'Guest') {
        element.innerHTML = getGuestMenuContent();
    } else {
        element.innerHTML = getUserMenuContent();
    }
}


/**
 * Returns the HTML content for the guest user menu.
 *
 * @function getGuestMenuContent
 * @returns {string} - The HTML content for the guest user menu.
 */
function getGuestMenuContent() {
    return /*html*/`
        <a class="top-menu-link pointer" href="legal-notice.html">Legal Notice</a>
        <a class="top-menu-link pointer" href="/privacy-policy.html">Privacy Policy</a>
        <a class="top-menu-link pointer" href="./index.html">Log in</a>
    `;
}


/**
 * Returns the HTML content for the logged-in user menu.
 *
 * @function getUserMenuContent
 * @returns {string} - The HTML content for the logged-in user menu.
 */
function getUserMenuContent() {
    return /*html*/`
        <a class="top-menu-link pointer" href="/legal-notice.html">Legal Notice</a>
        <a class="top-menu-link pointer" href="/privacy-policy.html">Privacy Policy</a>
        <a class="top-menu-link pointer" href="./index.html" onclick="logUserOut()">Log out</a>
    `;
}


/**
 * Sets up an event listener to hide the top bar menu when clicking outside of it.
 *
 * @function setupOutsideClickListener
 * @param {HTMLElement} element - The top bar menu element.
 */
function setupOutsideClickListener(element) {
    function handleClickOutside(event) {
        if (!element.contains(event.target)) {
            element.style.right = "-250px";
            document.removeEventListener("click", handleClickOutside);
            element.classList.remove("event-listener-added");
        }
    }

    if (!element.classList.contains("event-listener-added")) {
        setTimeout(() => {
            document.addEventListener("click", handleClickOutside);
            element.classList.add("event-listener-added");
        }, 10); // Short delay to prevent immediate hiding
    }
}


/**
 * Logs out the current user by setting the loggedInUser to 'Guest'.
 *
 * @function logUserOut
 */
function logUserOut() {
    loggedInUser = 'Guest';
}


/**
 * Updates the top bar button with the initials of the logged-in user or "G" for a guest.
 *
 * @async
 * @function putInitialInTopBar
 * @returns {Promise<void>}
 */
async function putInitialInTopBar() {
    const topBarButton = document.getElementById('top-bar-button');
    if (loggedInUser !== 'Guest') {
        topBarButton.innerHTML = loggedInitials;
    } else {
        topBarButton.innerHTML = "G";
        loggedInUser = "Guest";
    }
}


/**
 * Highlights the current page link in the navigation bar.
 *
 * @function highlightCurrentPageInNav
 */
function highlightCurrentPageInNav() {
    const currentUrl = window.location.href;
    if (currentUrl.includes('summary.html')) {
        resetHighlightLinkInNav('summary');
    }
    if (currentUrl.includes('add-task-page.html')) {
        resetHighlightLinkInNav('add-task');
    }
    if (currentUrl.includes('board.html')) {
        resetHighlightLinkInNav('board');
    }
    if (currentUrl.includes('contact.html')) {
        resetHighlightLinkInNav('contact');
    }
}


/**
 * Resets the highlight for the specified navigation link.
 *
 * @function resetHighlightLinkInNav
 * @param {string} pageId - The ID of the page to highlight in the navigation.
 */
function resetHighlightLinkInNav(pageId) {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => link.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}


/**
 * Resets the highlight for all footer links and highlights the specified link.
 *
 * @function resetHighlightLinkInNav
 * @param {string} linkId - The ID of the link to highlight.
 */
function resetHighlightLinkInNav(linkId) {
    removeFooterHighlight('footer-link-summary');
    removeFooterHighlight('footer-link-add-task');
    removeFooterHighlight('footer-link-board');
    removeFooterHighlight('footer-link-contact');
    highlightLinkInNav(linkId);
}

/**
 * Removes the "footer-selected" class from the specified footer link.
 *
 * @function removeFooterHighlight
 * @param {string} linkId - The ID of the footer link to remove the highlight from.
 */
function removeFooterHighlight(linkId) {
    const linkElement = document.getElementById(linkId);
    if (linkElement.classList.contains("footer-selected")) {
        linkElement.classList.remove("footer-selected");
    }
}


/**
 * Highlights the specified link in the navigation.
 *
 * @function highlightLinkInNav
 * @param {string} linkId - The ID of the link to highlight.
 */
function highlightLinkInNav(linkId) {
    document.getElementById(`footer-link-${linkId}`).classList.add("footer-selected");
}


/**
 * Initializes the privacy and legal pages by copying users to accounts,
 * loading login data, and setting the initials in the top bar.
 *
 * @async
 * @function privacyLegalInit
 * @returns {Promise<void>}
 */
async function privacyLegalInit() {
    await copyUsersToAccounts();
    await loadLoginData();
    await putInitialInTopBar();
}



