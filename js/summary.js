let urgentCount = 0;
let taskCount = 0;
let toDoCount = 0;
let inProgressCount = 0;
let doneCount = 0;
let awaitCount = 0;
let earliestDate = null;


/**
 * Loads tasks from remote storage and parses them into the global tasks variable.
 *
 * @async
 * @function loadTaskFromRemoteStorage
 * @returns {Promise<void>}
 */
async function loadTaskFromRemoteStorage() {
    tasks = JSON.parse(await getItem('tasks'));
}


/**
 * Loads summary data, including task counts and user data, and updates the summary page.
 *
 * @async
 * @function loadSummaryCount
 * @returns {Promise<void>}
 */
async function loadSummaryCount() {
    await loadTaskFromRemoteStorage();
    await loadLoginData();
    await loadUsers();
    await putInitialInTopBar();
    countUrgent();
    countTasks();
    countToDo();
    earliestDate = findEarliestDate();
    placeDataInSummaryPage();
    setGreetMessage();
    await greetedUser();
    checkWidthAndTrigger();
}


/**
 * Counts the number of tasks with 'Urgent' priority and updates the urgentCount variable.
 *
 * @function countUrgent
 */
function countUrgent() {
    for (let i = 0; i < tasks.length; i++) {
        let priority = tasks[i].priority;
        if (priority === 'Urgent') {
            urgentCount++;
        }
    }
}


/**
 * Counts the total number of tasks and updates the taskCount variable.
 *
 * @function countTasks
 */
function countTasks() {
    for (let i = 0; i < tasks.length; i++) {
        taskCount++;
    }
}


/**
 * Counts the number of tasks in each status category and updates the respective counters.
 *
 * @function countToDo
 */
function countToDo() {
    for (let i = 0; i < tasks.length; i++) {
        let status = tasks[i].status;
        updateTaskCount(status);
    }
}


/**
 * Updates the task count for the given status.
 *
 * @function updateTaskCount
 * @param {string} status - The status of the task to update the count for.
 */
function updateTaskCount(status) {
    if (status === 'to-do-column') {
        toDoCount++;
    } else if (status === 'in-progress-column') {
        inProgressCount++;
    } else if (status === 'done-column') {
        doneCount++;
    } else if (status === 'await-feedback-column') {
        awaitCount++;
    }
}


/**
 * Finds the earliest date among the tasks that have a due date set and returns it.
 *
 * @function findEarliestDate
 * @returns {Date|null} The earliest due date found among the tasks, or null if no valid dates are found.
 */
function findEarliestDate() {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    let earliestDate = null;
    for (let i = 0; i < tasks.length; i++) {
        if (tasks[i].date.length > 0) {
            const currentDate = new Date(tasks[i].date);
            currentDate.setHours(0, 0, 0, 0);
            if (currentDate >= today && (earliestDate === null || currentDate < earliestDate)) {
                earliestDate = currentDate;
            }
        }
    }
    return earliestDate;
}


/**
 * Converts the earliest date to a formatted string.
 *
 * @function earliestDateWasFound
 * @param {Date|null} earliestDate - The earliest due date.
 * @returns {string} The formatted date string or a default message if no date is found.
 */
function earliestDateWasFound(earliestDate) {
    if (earliestDate) {
        return earliestDate.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    } else {
        return 'Currently no';
    }
}


/**
 * Updates the summary page with the task counts and earliest date.
 *
 * @function placeDataInSummaryPage
 */
function placeDataInSummaryPage() {
    document.getElementById('summary-to-do').innerHTML = toDoCount;
    document.getElementById('summary-done').innerHTML = doneCount;
    document.getElementById('summary-urgency').innerHTML = urgentCount;
    document.getElementById('summary-date').innerHTML = earliestDateWasFound(earliestDate);
    document.getElementById('summary-tasks').innerHTML = taskCount;
    document.getElementById('summary-progress').innerHTML = inProgressCount;
    document.getElementById('summary-feedback').innerHTML = awaitCount;
}


/**
 * Sets the greeting message based on the current time of day.
 *
 * @function setGreetMessage
 */
function setGreetMessage() {
    let container = document.getElementById('greet');
    let now = new Date();
    let hour = now.getHours();
    if (hour >= 6 && hour < 12) { // 6:00 - 11:59 Morning
        container.innerHTML = 'Good Morning';
    } else if (hour >= 12 && hour < 17) { // 12:00 - 16:59 Afternoon
        container.innerHTML = 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) { // 17:00 - 20:59 Evening
        container.innerHTML = 'Good Evening';
    } else { // 21:00 - 5:59 Night
        container.innerHTML = 'Good Night';
    }
}


/**
 * Sets the greeting message for mobile view based on the current time of day.
 *
 * @function setGreetMessageMobile
 * @returns {string} The greeting message.
 */
function setGreetMessageMobile() {
    let now = new Date();
    let hour = now.getHours();
    let time;
    if (hour >= 6 && hour < 12) { // 6:00 - 11:59 Morning
        time = 'Good Morning';
    } else if (hour >= 12 && hour < 17) { // 12:00 - 16:59 Afternoon
        time = 'Good Afternoon';
    } else if (hour >= 17 && hour < 21) { // 17:00 - 20:59 Evening
        time = 'Good Evening';
    } else { // 21:00 - 5:59 Night
        time = 'Good Night';
    }
    return time;
}


/**
 * Updates the greeting with the logged-in user's name.
 *
 * @async
 * @function greetedUser
 * @returns {Promise<void>}
 */
async function greetedUser() {
    let container = document.getElementById('summary-user');
    if (typeof loggedInUser === "undefined" || loggedInUser === "Guest") {
        container.innerHTML = "";
    } else {
        container.innerHTML = `${loggedInUser}`;
    }
}


/**
 * Forces the restart of the background animation.
 *
 * @function forceRestartAnimation
 */
function forceRestartAnimation() {
    const bg = document.getElementById('start-background');
    bg.classList.remove('opak');
    void bg.offsetWidth;
    bg.classList.add('opak');
}


/**
 * Updates the greeting message and user display for screen widths 1024px or less.
 *
 * @function onWidth1024OrLess
 */
function onWidth1024OrLess() {
    const bg = document.getElementById('start-background');
    let time = setGreetMessageMobile();
    if (loggedInUser === "Guest") {
        bg.innerHTML = /*html*/`<div class="summary-greet">${time}</div>`;
    }
    if (loggedInUser !== "Guest") {
        bg.innerHTML = /*html*/`<div class="summary-greet">${time}</div><div class="greet-user-mobile">${loggedInUser}</div>`;
    }
    bg.classList.remove('d-none');
    forceRestartAnimation();
}


/**
 * Hides the background animation for screen widths above 1024px.
 *
 * @function onWidthAbove1024
 */
function onWidthAbove1024() {
    const bg = document.getElementById('start-background');
    bg.classList.add('d-none');
    bg.classList.remove('opak');
}


/**
 * Checks the window width and triggers the appropriate function based on the width.
 *
 * @function checkWidthAndTrigger
 */
function checkWidthAndTrigger() {
    const currentWidth = window.innerWidth;
    if (currentWidth <= 840) {
        onWidth1024OrLess();
    } else {
        onWidthAbove1024();
    }
}

window.addEventListener('resize', checkWidthAndTrigger);
