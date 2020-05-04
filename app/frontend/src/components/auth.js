/**
 * This is where the authentication process is done.
 * It supposes a login microservice that returns a JWT token when the user and password are correct.
 * The JWT token is saved on the local storage and used to send subsequent requests.
 * You can modify this file to use your own users database.
 */

import axios from "axios";

const HOST_ADDRESS =
  location.protocol + "//" + location.host + location.pathname;

// name of the key containing the token to be saved in the local storage
const token_name = "Jtoken";

// verifies if the user is valid, and set the token in the local storage
// The JWT token should include a userId field
export async function authenticate(username, password) {
  // let auth = false;
  await axios
    .post(`${HOST_ADDRESS}api/login`, {
      username: username,
      password: password
    })
    .then(res => {
      localStorage.setItem(token_name, res.data.token);
    })
    .catch(err => {
      throw err;
    });
  return "Success";
}

// registers a new user
export function register(username, password) {
  if (username == "" || password == "") throw "empty fields";

  return axios.post(`${HOST_ADDRESS}api/register`, {
    username: username,
    password: password,
    admin: true
  });
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
