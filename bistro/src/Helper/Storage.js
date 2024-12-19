// COOKIES, LOCAL STORAGE

export const setAuthUser = (data) => {
  // save object to the local storage
  // Stringify OBJECT TO TEXT
  localStorage.setItem("user", JSON.stringify(data));
};
export const setUserToken = (data) => {
  // save object to the local storage
  // Stringify OBJECT TO TEXT
  localStorage.setItem("user_token", JSON.stringify(data));
};

export const getAuthUser = (data) => {
  if (localStorage.getItem("user")) {
    return JSON.parse(localStorage.getItem("user"));
  }
};
export const getUserToken = (data) => {
  if (localStorage.getItem("user_token")) {
    return JSON.parse(localStorage.getItem("user_token"));
  }
};

export const removeAuthUser = () => {
  if (localStorage.getItem("user")) localStorage.removeItem("user");
};
export const removeUserToken = () => {
  if (localStorage.getItem("user_token")) localStorage.removeItem("user_token");
};
