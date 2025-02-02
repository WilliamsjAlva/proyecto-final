// src/context/AuthContext.jsx
import React, { createContext, useState, useEffect } from 'react';

// Creamos el contexto
export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    // Recuperamos el token del localStorage si existe
    const token = localStorage.getItem('token');
    return token ? { token } : null;
  });

  // Función para guardar el token en el estado y localStorage
  const login = (data) => {
    setAuth({ token: data.token, user: data.user });
    localStorage.setItem('token', data.token);
  };

  // Función para cerrar sesión
  const logout = () => {
    setAuth(null);
    localStorage.removeItem('token');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
