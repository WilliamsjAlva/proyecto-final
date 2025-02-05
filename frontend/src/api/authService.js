// src/api/authService.js
import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

// Función para registrar un usuario
export const registerUser = async (userData) => {
    const response = await axios.post(`${API_URL}/register`, userData);
    return response.data;
};

// Función para iniciar sesión
export const loginUser = async (credentials) => {
    const response = await axios.post(`${API_URL}/login`, credentials);
    return response.data;
};
