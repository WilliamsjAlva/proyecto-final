import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const NewPostForm = ({ onPostCreated }) => {
    const { auth } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        anonymous: false,
        image: "",
        allowPrivateChat: false,
    });
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("http://localhost:5000/api/posts", formData, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            onPostCreated(response.data.post);
            setFormData({
                title: "",
                description: "",
                anonymous: false,
                image: "",
                allowPrivateChat: false,
            });
        } catch (err) {
            console.error(err);
            setError("Error al crear la publicación. Inténtalo de nuevo más tarde.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded">
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <input
                type="text"
                name="title"
                placeholder="Título de la publicación"
                value={formData.title}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2"
                required
            />
            <textarea
                name="description"
                placeholder="Descripción..."
                value={formData.description}
                onChange={handleChange}
                className="w-full p-2 border rounded mb-2"
                required
            ></textarea>
            <label className="flex items-center mb-2">
                <input
                    type="checkbox"
                    name="anonymous"
                    checked={formData.anonymous}
                    onChange={handleChange}
                    className="mr-2"
                />
                Publicar de forma anónima
            </label>
            <button type="submit" className="px-4 py-2 bg-green-500 text-white rounded">
                Publicar
            </button>
        </form>
    );
};

export default NewPostForm;
