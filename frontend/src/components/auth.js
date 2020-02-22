import axios from "axios"




// name of the key to be saved in the local storage
const token_name = 'Jtoken'

// this function calls the auth service,
// verify if the user is valid,
// and set the token in the local storage
// Used in Login.jsx
export async function authenticate(user, password) {
    let auth = false
    await axios.post('http://localhost:3000/api/login', { user: user, password: password })
        .then(res => {
            localStorage.setItem(token_name, res.data.token)
            auth = true
        })
        .catch(err => { console.log('error', err); auth = false })
    return auth
};

// verify if the user has already logged in. Returns a promise. Used in Login.jsx
export async function isAuthenticated() {
    const token = localStorage.getItem(token_name)
    let auth = false
    await axios.post('http://localhost:3000/api/login/verify', { token: token })
        .then(res => {
            if (res.data) {
                auth = true
            }
            else {
                auth = false
            }
        })
    return auth
};

// function used to get the token to send authenticated graphql requests. Used in App.jsx
export const getToken = () => {
    return localStorage.getItem(token_name)
};