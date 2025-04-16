// src/services/authService.js

// Retorna el token almacenado en el localStorage
export const getToken = () => {
    return localStorage.getItem("token");
};

// Guarda el token en el localStorage
export const setToken = (token) => {
    localStorage.setItem("token", token);
};

// Remueve el token del localStorage (por ejemplo, al cerrar sesión)
export const removeToken = () => {
    localStorage.removeItem("token");
};

// Puedes agregar aquí otras funciones relacionadas a la autenticación,