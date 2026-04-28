const auth = {
  setUser: (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
  },
  getUser: () => {
    return JSON.parse(localStorage.getItem("user"));
  },
  isLoggedIn: () => {
    return localStorage.getItem("user") !== null;
  },
  logout: () => {
    localStorage.removeItem("user");
    window.location.href = "/";
  },
};
