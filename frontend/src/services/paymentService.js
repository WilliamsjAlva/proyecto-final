// frontend/src/services/paymentService.js
import axios from "axios";

// Utiliza la variable de entorno propia de Vite
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api/payments";

// Función para subir la imagen del comprobante
const uploadScreenshot = async (file) => {
    const formData = new FormData();
    formData.append("screenshot", file);
    const response = await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
};

// Función para crear la solicitud de pago en el backend
const createPaymentRequest = async (data) => {
    const response = await axios.post(`${API_URL}/request`, data);
    return response.data;
};

export { uploadScreenshot, createPaymentRequest };
