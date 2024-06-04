/**
 * Creates initials from the names in the accounts array.
 *
 * This function iterates over the accounts array and creates initials for each account name.
 * The initials are then stored in the 'initials' property of each account object.
 *
 * @function createInitialsFromName
 */
function createInitialsFromName() {
    for (let i = 0; i < accounts.length; i++) {
        const fullName = accounts[i]['name'];
        const initials = getInitials(fullName);
        accounts[i]['initials'] = initials;
    }
}


/**
 * Generates initials from a full name.
 *
 * This function splits the given name into words and returns the initials formed by the first letter of each word.
 *
 * @function getInitials
 * @param {string} name - The full name from which to generate initials.
 * @returns {string} The initials formed by the first letter of each word in the name.
 */
function getInitials(name) {
    return name.split(' ').map(word => word[0]).join('');
}

let accounts = [];
let tasks = [];
