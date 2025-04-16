import axios from "axios";

const API_URL = "http://localhost:5000/api/notifications";

const getNotifications = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.get(API_URL, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

const markAsRead = async (id) => {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/mark-as-read/${id}`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

const markAllAsRead = async () => {
    const token = localStorage.getItem("token");
    const response = await axios.put(`${API_URL}/mark-all-as-read`, {}, {
        headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
};

export default {
    getNotifications,
    markAsRead,
    markAllAsRead,
};
