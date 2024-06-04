const STORAGE_TOKEN = "NFM9XSXFTRCA68M0UD3HARUQZA3D2X0ED55X011J";
const STORAGE_URL = "https://remote-storage.developerakademie.org/item";

/**
 * Stores an item in the remote storage.
 *
 * @async
 * @function setItem
 * @param {string} key - The key under which the item is stored.
 * @param {string} value - The value to be stored.
 * @returns {Promise<Object>} - The response from the remote storage.
 */
async function setItem(key, value) {
    const payload = { key, value, token: STORAGE_TOKEN };
    return fetch(STORAGE_URL, {
        method: "POST",
        body: JSON.stringify(payload),
    }).then((res) => res.json());
}


/**
 * Retrieves an item from the remote storage.
 *
 * @async
 * @function getItem
 * @param {string} key - The key of the item to be retrieved.
 * @returns {Promise<string>} - The value of the retrieved item.
 * @throws {string} - An error message if the item is not found.
 */
async function getItem(key) {
    const url = `${STORAGE_URL}?key=${key}&token=${STORAGE_TOKEN}`;
    return fetch(url)
        .then((res) => res.json())
        .then((res) => {
            if (res.data) {
                return res.data.value;
            }
            throw `Could not find data with key "${key}".`;
        });
}
