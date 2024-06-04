let loggedInUser;
let loggedInitials;

/**
 * Parses URL parameters and sets the message element if a message is present.
 *
 * @function
 */
const urlParams = new URLSearchParams(window.location.search);
const msg = urlParams.get("msg");
if (msg) {
    msg.innerHTML = msg;
}


/**
 * Logs out the current user, setting the user as "Guest" and updating storage.
 *
 * @async
 * @function logout
 * @returns {Promise<void>}
 */
async function logout() {
    loggedInUser = "Guest";
    loggedInitials = "G";
    await setItem('loggedInUser', JSON.stringify(loggedInUser));
    await setItem('loggedInitials', JSON.stringify(loggedInitials));
}


/**
 * Handles the login process by validating email and password inputs and checking login data.
 *
 * @async
 * @function login
 * @returns {Promise<void>}
 */
async function login() {
    await giveFeedbacktoLoginInputEmail();
    await giveFeedbacktoLoginInputPassword();
    await checkIfLoginDataIsCorrect();
}


/**
 * Provides feedback for the login email input field.
 *
 * @async
 * @function giveFeedbacktoLoginInputEmail
 * @returns {Promise<void>}
 */
async function giveFeedbacktoLoginInputEmail() {
    let email = document.getElementById("emailLogIn");
    let container = document.getElementById("emailogincontainer");
    let user = users.find((u) => u.email == email.value);
    if (!user) {
        let enteredPass = document.getElementById("password-validation");
        enteredPass.classList.remove("d-none");
        container.classList.add("form-error");
    }
}


/**
 * Removes the error from the email login input field.
 *
 * @function removeErrorFromEmailLogin
 */
function removeErrorFromEmailLogin() {
    let enteredMail = document.getElementById("account-validation");
    let container = document.getElementById("emailogincontainer");
    enteredMail.classList.add("d-none");
    container.classList.remove("form-error");
}


/**
 * Provides feedback for the login password input field.
 *
 * @async
 * @function giveFeedbacktoLoginInputPassword
 * @returns {Promise<void>}
 */
async function giveFeedbacktoLoginInputPassword() {
    let email = document.getElementById("emailLogIn");
    let password = document.getElementById("passwordLogIn");
    let passwordField = document.getElementById("passwordlogincontainer");
    let user = users.find((u) => u.email == email.value && u.password != password.value);
    if (user) {
        let enteredPass = document.getElementById("password-validation");
        enteredPass.classList.remove("d-none");
        passwordField.classList.add("form-error");
    }
}


/**
 * Checks if the login data is correct and redirects to the summary page if successful.
 *
 * @async
 * @function checkIfLoginDataIsCorrect
 * @returns {Promise<void>}
 */
async function checkIfLoginDataIsCorrect() {
    let email = document.getElementById("emailLogIn");
    let password = document.getElementById("passwordLogIn");

    setTimeout(async () => {
        let user = users.find((u) => u.email == email.value && u.password == password.value);
        if (user) {
            await saveLoginData(user);
            window.location.href = "summary.html";
        }
    }, 1000); // Wait 1 second (adjust according to loading time)
}


/**
 * Removes the error from the password input field.
 *
 * @function removeErrorFromPasswordField
 */
function removeErrorFromPasswordField() {
    let enteredPass = document.getElementById("password-validation");
    enteredPass.classList.add("d-none");
    let passwordField = document.getElementById("passwordlogincontainer");
    passwordField.classList.remove("form-error");
}


/**
 * Saves the login data of the user to local storage.
 *
 * @async
 * @function saveLoginData
 * @param {Object} user - The user object containing the username.
 * @returns {Promise<void>}
 */
async function saveLoginData(user) {
    loggedInUser = user.username;
    let names = loggedInUser.split(' '); 
    let initials = names.map(name => name[0]).join(''); 
    loggedInitials = initials;
    await setItem('loggedInUser', JSON.stringify(loggedInUser));
    await setItem('loggedInitials', JSON.stringify(loggedInitials));
}


/**
 * Loads the login data of the user from local storage.
 *
 * @async
 * @function loadLoginData
 * @returns {Promise<void>}
 */
async function loadLoginData() {
    loggedInUser = await getItem('loggedInUser');
    loggedInitials = await getItem('loggedInitials');
}


/**
 * Redirects the user to the signup page.
 *
 * @function goToSignUp
 */
function goToSignUp() {
    window.location.href = "signup.html";
}


/**
 * Animates the logo and background elements on the start page.
 *
 * @async
 * @function animateLogo
 * @returns {Promise<void>}
 */
async function animateLogo() {
    const logo = document.getElementById('start-logo');
    const bg = document.getElementById('start-background');
    logo.classList.add('small');
    bg.classList.add('opak');
}


/**
 * Sets up event listeners for the password field and icon to toggle visibility.
 *
 * @function controlPasswordField
 */
function controlPasswordField() {
    const passwordField = document.getElementById('passwordLogIn');
    const passwordIcon = document.getElementById('passwordIcon');

    addPasswordFieldFocusListener(passwordField, passwordIcon);
    addPasswordIconClickListener(passwordField, passwordIcon);
}


/**
 * Adds an event listener to the password field to change the icon on focus.
 *
 * @function addPasswordFieldFocusListener
 * @param {HTMLElement} passwordField - The password input field element.
 * @param {HTMLElement} passwordIcon - The password visibility icon element.
 */
function addPasswordFieldFocusListener(passwordField, passwordIcon) {
    passwordField.addEventListener('focus', function () {
        if (passwordField.type === 'password') {
            passwordIcon.src = '/assets/img/show_password.svg';
        }
    });
}


/**
 * Adds an event listener to the password icon to toggle the password visibility.
 *
 * @function addPasswordIconClickListener
 * @param {HTMLElement} passwordField - The password input field element.
 * @param {HTMLElement} passwordIcon - The password visibility icon element.
 */
function addPasswordIconClickListener(passwordField, passwordIcon) {
    passwordIcon.addEventListener('click', function () {
        togglePasswordVisibility(passwordField, passwordIcon);
        passwordField.focus();
    });
}


/**
 * Toggles the visibility of the password field and changes the icon.
 *
 * @function togglePasswordVisibility
 * @param {HTMLElement} passwordField - The password input field element.
 * @param {HTMLElement} passwordIcon - The password visibility icon element.
 */
function togglePasswordVisibility(passwordField, passwordIcon) {
    if (passwordField.type === 'password') {
        passwordField.type = 'text';
        passwordIcon.src = '/assets/img/hide_password.svg';
    } else {
        passwordField.type = 'password';
        passwordIcon.src = '/assets/img/show_password.svg';
    }
}


/**
 * Redirects the user to the summary page for a guest login.
 *
 * @function guestLogin
 */
function guestLogin() {
    window.location.href = "summary.html";
}
