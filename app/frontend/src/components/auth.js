/**
 * This is where the authentication process is done.
 * It supposes a login microservice that returns a JWT token when the user and password are correct.
 * The JWT token is saved on the local storage and used to send subsequent requests.
 * You can modify this file to use your own users database.
 */

import axios from "axios";

const HOST_ADDRESS = "127.0.0.1";
const PORT = "5000";
// name of the key containing the token to be saved in the local storage
const token_name = "Jtoken";

// verifies if the user is valid, and set the token in the local storage
// The JWT token should include a userId field
export async function authenticate(username, password) {
  let auth = false;
  await axios
    .post(`http://${HOST_ADDRESS}:${PORT}/api/login`, {
      username: username,
      password: password
    })
    .then(res => {
      localStorage.setItem(token_name, res.data.token);
      auth = true;
    })
    .catch(err => {
      console.log("error: ", err.response.data);
      auth = false;
    });
  return auth;
}

// verifies if the token in the local storage is true or false.
// export async function isAuthenticated() {
//   const token = getToken();
//   let auth = false;
//   await axios
//     .post(`http://${HOST_ADDRESS}:${PORT}/api/login/verify`, { token: token })
//     .then(res => {
//       if (res.data) {
//         auth = true;
//       } else {
//         auth = false;
//       }
//     });
//   return auth;
// }

// registers a new user
export async function register(username, password) {
  let success = false;
  if (username == "" || password == "") throw "empty fields";
  await axios
    .post(`http://${HOST_ADDRESS}:${PORT}/api/register`, {
      username: username,
      password: password,
      admin: true
    })
    .then(res => {
      if (res.data) {
        success = true;
      } else {
        success = false;
      }
    });
  return success;
}

// gets the token from the local storage.
export const getToken = () => {
  return localStorage.getItem(token_name);
};

// clears the token from the local storage
export const logOut = () => {
  localStorage.removeItem(token_name);
  location.reload();
};
