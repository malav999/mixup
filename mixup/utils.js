// If the object is null return false 
function isNull(obj) {
    if (undefined === obj || obj === null) {
        return false
    }
    return true
}

// Throws error if the given param is not a number
function isNumber(num, message) {
    if (undefined === num || num === null || typeof (num) !== "number") {
        if (undefined !== message) {
            console.log('Invalid ' + message)
        }
        throw 'Invalid input'
    }
}

// Throws error if the given param is not an array
function isArray(arr, message) {
    if (undefined === arr || !Array.isArray(arr) || arr.length === 0) {
        if (undefined !== message) {
            console.log('Invalid ' + message)
        }
        throw 'Invalid input'
    }
}

// Throws error if the given param is not a string
function isString(str, message) {
    if (undefined === str || str === null || str === '' || typeof (str) !== 'string') {
        if (undefined !== message) {
            console.log('Invalid ' + message)
        }
        throw 'Invalid input'
    }
}

// Returns true if the string is not empty
// Else returns false
function isNotEmpty(str) {
    if (undefined !== str || str !== null || typeof (str) === 'string' || '' === str.trim()) {
        return true
    }
    return false
}

// Returns true if the string is not empty and valid
function isValidEmail(email) {
    if (isNotEmpty(email)) {
        let sanitizedEmail = sanitize(email)
        if (/^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(sanitizedEmail)) {
            return true
        }
    }

    return false
}

// Clean email structure
function sanitize(str) {
    let sanitizedStr = str.toString().trim()
    sanitizedStr = sanitizedStr.toLowerCase()
    console.log('sanitizedStr', sanitizedStr)

    return sanitizedStr
}

// function isValidPassword(password) {
//     if (!Util.isNull(password)) {
//         if (/^.{8,}$/.test(toString(password))) {
//             return true
//         }
//     }

//     return false
// }


module.exports = {
    isNull,
    isNumber,
    isArray,
    isString,
    isNotEmpty,
    isValidEmail,
    // isValidPassword,
}