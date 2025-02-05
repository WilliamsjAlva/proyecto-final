// src/contexts/AuthContext.jsx
import React, { createContext, useState } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [auth, setAuth] = useState(() => {
    const token = localStorage.getItem('token');
    // Si el token existe, podrías querer recuperar también el usuario (por ejemplo, almacenado en localStorage o decodificar el token)
    // Por simplicidad, asumiremos que la info se almacena en el contexto tras el login.
    return token ? { token, user: JSON.parse(localStorage.getItem('user')) } : null;
  });

  const login = (data) => {
    // data debe incluir { token, user }
    setAuth({ token: data.token, user: data.user });
    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
  };

  const logout = () => {
    setAuth(null);
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ auth, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};
