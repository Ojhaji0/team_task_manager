export const setAuth = (token, userId, role) => {
  localStorage.setItem("token", token);
  localStorage.setItem("userId", userId);
  localStorage.setItem("role", role);
};

export const getToken = () => {
  return localStorage.getItem("token");
};

export const getUserId = () => {
  return localStorage.getItem("userId");
};

export const getRole = () => {
  return localStorage.getItem("role");
};

export const isAuthed = () => {
  return !!getToken();
};

export const isAdmin = () => {
  return getRole() === "admin";
};

export const isMember = () => {
  return getRole() === "member";
};

export const logout = () => {
  localStorage.removeItem("token");
  localStorage.removeItem("userId");
  localStorage.removeItem("role");
};