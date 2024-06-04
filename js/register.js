let users = [];

/**
 * Initializes the registration process by logging out, copying users to accounts, and registering password fields if on the signup page.
 *
 * @async
 * @function initRegister
 * @returns {Promise<void>} A promise that resolves when the initialization is complete.
 */
async function initRegister() {
  await logout();
  await copyUsersToAccounts();
  if (window.location.pathname === '/signup.html') {
    registerPasswordFieldA();
    registerPasswordFieldB();
  }
}


/**
 * Loads users from remote storage and parses them into the global users array.
 *
 * @async
 * @function loadUsers
 * @returns {Promise<void>} A promise that resolves when the users are loaded.
 */
async function loadUsers() {
  try {
    users = JSON.parse(await getItem("users"));
  } catch (e) {
    console.error("Loading error:", e);
  }
}


/**
 * Capitalizes the first letter of a string.
 *
 * @function capitalizeFirstLetter
 * @param {string} string - The string to capitalize.
 * @returns {string} The string with the first letter capitalized.
 */
function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1).toLowerCase();
}


/**
 * Formats a username by capitalizing the first letter of each word.
 *
 * @function formatUsername
 * @param {string} username - The username to format.
 * @returns {string} The formatted username.
 */
function formatUsername(username) {
  return username.split(' ').map(capitalizeFirstLetter).join(' ');
}


/**
 * Handles the registration process, including form validation and user data storage.
 *
 * @async
 * @function register
 * @returns {Promise<void>} A promise that resolves when the registration process is complete.
 */
async function register() {
  let { usernameInput, email, password, password2, privacyPolicyCheckbox, registerBtn, validationContainer, passwordConA, passwordConB } = getFormData();
  registerBtn.disabled = true;
  if (!validatePasswords(password, password2, passwordConA, passwordConB, registerBtn, validationContainer)) return;
  if (!checkPrivacyPolicy(privacyPolicyCheckbox, registerBtn)) return;
  await processRegistration(usernameInput, email, password, registerBtn);
}


/**
 * Retrieves form data for the registration process.
 *
 * @function getFormData
 * @returns {Object} An object containing the form data.
 */
function getFormData() {
  return {
    usernameInput: document.getElementById("username").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value,
    password2: document.getElementById("password2").value,
    privacyPolicyCheckbox: document.getElementById("privacyPolicy").checked,
    registerBtn: document.getElementById("registerBtn"),
    validationContainer: document.getElementById("password-register-validation-container"),
    passwordConA: document.getElementById("password-container-A"),
    passwordConB: document.getElementById("password-container-B")
  };
}


/**
 * Validates the password fields in the registration form.
 *
 * @function validatePasswords
 * @param {string} password - The password value.
 * @param {string} password2 - The repeated password value.
 * @param {HTMLElement} passwordConA - The first password container element.
 * @param {HTMLElement} passwordConB - The second password container element.
 * @param {HTMLElement} registerBtn - The register button element.
 * @param {HTMLElement} validationContainer - The validation message container element.
 * @returns {boolean} True if the passwords are valid, false otherwise.
 */
function validatePasswords(password, password2, passwordConA, passwordConB, registerBtn, validationContainer) {
  if (password !== password2) {
    passwordConA.classList.add("form-error");
    passwordConB.classList.add("form-error");
    registerBtn.disabled = false;
    validationContainer.classList.remove("d-none");
    return false;
  }
  passwordConA.classList.remove("form-error");
  passwordConB.classList.remove("form-error");
  validationContainer.classList.add("d-none");
  return true;
}


/**
 * Checks if the privacy policy checkbox is checked.
 *
 * @function checkPrivacyPolicy
 * @param {boolean} privacyPolicyCheckbox - The privacy policy checkbox value.
 * @param {HTMLElement} registerBtn - The register button element.
 * @returns {boolean} True if the privacy policy is accepted, false otherwise.
 */
function checkPrivacyPolicy(privacyPolicyCheckbox, registerBtn) {
  if (!privacyPolicyCheckbox) {
    document.getElementById('errorPrivacy').classList.remove('d-none');
    registerBtn.disabled = false;
    return false;
  }
  return true;
}


/**
 * Hides the privacy policy error message.
 *
 * @function hideErrorPrivacy
 */
function hideErrorPrivacy() {
  document.getElementById('errorPrivacy').classList.add('d-none');
}


/**
 * Processes the registration by formatting the username, adding the user to the users array, and saving the user data.
 *
 * @async
 * @function processRegistration
 * @param {string} usernameInput - The entered username.
 * @param {string} email - The entered email.
 * @param {string} password - The entered password.
 * @param {HTMLElement} registerBtn - The register button element.
 * @returns {Promise<void>} A promise that resolves when the registration process is complete.
 */
async function processRegistration(usernameInput, email, password, registerBtn) {
  let username = formatUsername(usernameInput);
  let maxId = accounts.reduce((max, { id }) => Math.max(max, id), 0);
  users.push({ id: ++maxId, username: username, email: email, password: password });
  await saveUserData(registerBtn);
}


/**
 * Saves the user data to remote storage and resets the registration form.
 *
 * @async
 * @function saveUserData
 * @param {HTMLElement} registerBtn - The register button element.
 * @returns {Promise<void>} A promise that resolves when the user data is saved.
 */
async function saveUserData(registerBtn) {
  try {
    await setItem("users", JSON.stringify(users));
    resetForm();
    window.location.href = 'index.html?msg=Erfolgreich Registriert';
  } catch (e) {
    console.error("Registration error:", e);
    registerBtn.disabled = false;
  }
}


/**
 * Resets the registration form fields and checkbox.
 *
 * @function resetForm
 */
function resetForm() {
  document.getElementById("username").value = "";
  document.getElementById("email").value = "";
  document.getElementById("password").value = "";
  document.getElementById("password2").value = "";
  document.getElementById("privacyPolicy").checked = false;
}


/**
 * Registers the focus event listener for the password field.
 *
 * This function adds an event listener to the password field that changes the password icon to show a password icon when the field is focused and is of type 'password'.
 *
 * @function registerPasswordFocusEvent
 */
function registerPasswordFocusEvent() {
  const passwordField = document.getElementById('password');
  const passwordIcon = document.getElementById('password-icon-A');
  passwordField.addEventListener('focus', function () {
    if (passwordField.type === 'password') {
      passwordIcon.src = '/assets/img/show_password.svg';
    }
  });
}


/**
 * Registers the click event listener for the password icon.
 *
 * This function adds an event listener to the password icon that toggles the password visibility and changes the icon when the icon is clicked.
 *
 * @function registerPasswordIconClickEvent
 */
function registerPasswordIconClickEvent() {
  const passwordField = document.getElementById('password');
  const passwordIcon = document.getElementById('password-icon-A');
  passwordIcon.addEventListener('click', function () {
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      passwordIcon.src = '/assets/img/hide_password.svg';
    } else {
      passwordField.type = 'password';
      passwordIcon.src = '/assets/img/show_password.svg';
    }
    passwordField.focus();
  });
}


/**
 * Wrapper function that registers both the focus and click event listeners for the password field and icon.
 *
 * This function calls both `registerPasswordFocusEvent` and `registerPasswordIconClickEvent` to set up the necessary event listeners for the password field and icon.
 *
 * @function registerPasswordFieldA
 */
function registerPasswordFieldA() {
  registerPasswordFocusEvent();
  registerPasswordIconClickEvent();
}


/**
 * Registers the focus event listener for the second password field.
 *
 * This function adds an event listener to the password field that changes the password icon to show a password icon when the field is focused and is of type 'password'.
 *
 * @function registerPasswordFocusEventB
 */
function registerPasswordFocusEventB() {
  const passwordField = document.getElementById('password2');
  const passwordIcon = document.getElementById('password-icon-B');
  passwordField.addEventListener('focus', function () {
    if (passwordField.type === 'password') {
      passwordIcon.src = '/assets/img/show_password.svg';
    }
  });
}


/**
 * Registers the click event listener for the second password icon.
 *
 * This function adds an event listener to the password icon that toggles the password visibility and changes the icon when the icon is clicked.
 *
 * @function registerPasswordIconClickEventB
 */
function registerPasswordIconClickEventB() {
  const passwordField = document.getElementById('password2');
  const passwordIcon = document.getElementById('password-icon-B');
  passwordIcon.addEventListener('click', function () {
    if (passwordField.type === 'password') {
      passwordField.type = 'text';
      passwordIcon.src = '/assets/img/hide_password.svg';
    } else {
      passwordField.type = 'password';
      passwordIcon.src = '/assets/img/show_password.svg';
    }
    passwordField.focus();
  });
}


/**
 * Wrapper function that registers both the focus and click event listeners for the second password field and icon.
 *
 * This function calls both `registerPasswordFocusEventB` and `registerPasswordIconClickEventB` to set up the necessary event listeners for the second password field and icon.
 *
 * @function registerPasswordFieldB
 */
function registerPasswordFieldB() {
  registerPasswordFocusEventB();
  registerPasswordIconClickEventB();
}
