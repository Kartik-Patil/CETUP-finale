export const loginUser = (token, userData) => {
  localStorage.setItem("token", token);
  localStorage.setItem("role", userData.role);
  localStorage.setItem("user", JSON.stringify(userData));
};

export const setUser = (userData) => {
  localStorage.setItem("user", JSON.stringify(userData));
  if (userData.role) {
    localStorage.setItem("role", userData.role);
  }
};

export const logoutUser = () => {
  localStorage.clear();
};

export const getRole = () => localStorage.getItem("role");
export const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
export const isLoggedIn = () => !!localStorage.getItem("token");