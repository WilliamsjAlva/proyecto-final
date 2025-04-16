/* eslint-disable */
import React, { useState, useContext, useRef } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/text.css";
import PrimaryButton from "../components/PrimaryButton"

const NewPostForm = ({ onPostCreated }) => {
    const { auth } = useContext(AuthContext);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        anonymous: false,
        allowPrivateChat: false,
    });
    const [selectedImage, setSelectedImage] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [error, setError] = useState("");

    const fileInputRef = useRef(null);

    const handleChange = (e) => {
        const { name, value, type, checked } = e.target;
        setFormData({
            ...formData,
            [name]: type === "checkbox" ? checked : value,
        });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setSelectedImage(file);
        if (file) {
            setPreviewUrl(URL.createObjectURL(file));
        } else {
            setPreviewUrl(null);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = new FormData();
            data.append("title", formData.title);
            data.append("description", formData.description);
            data.append("anonymous", formData.anonymous);
            data.append("allowPrivateChat", formData.allowPrivateChat);
            if (selectedImage) {
                data.append("image", selectedImage);
            }
            const response = await axios.post("http://localhost:5000/api/posts", data, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            onPostCreated(response.data.post);
            setFormData({
                title: "",
                description: "",
                anonymous: false,
                allowPrivateChat: false,
            });
            setSelectedImage(null);
            setPreviewUrl(null);
        } catch (err) {
            console.error(err);
            setError("Error al crear el ticket. Inténtalo de nuevo más tarde.");
        }
    };

    return (
        <form onSubmit={handleSubmit} className="mb-6 p-4 bg-[#fcfcfc] border-[1px] border-[#dedede] rounded">
            {error && <p className="text-red-500 mb-2">{error}</p>}
            <input
                type="text"
                name="title"
                placeholder="Título del ticket"
                value={formData.title}
                onChange={handleChange}
                className="pWeb w-full p-2 border-[1px] border-[#cccccc] rounded mb-2"
                required
            />
            <textarea
                name="description"
                placeholder="Descripción..."
                value={formData.description}
                onChange={handleChange}
                className="pWeb w-full p-2 border-[1px] border-[#cccccc] rounded mb-2"
                required
            ></textarea>
            <label className="flex items-center mb-2">
                <input
                    type="checkbox"
                    name="anonymous"
                    checked={formData.anonymous}
                    onChange={handleChange}
                    className="pWeb mr-2"
                />
                Publicar de forma anónima
            </label>

            {/* Contenedor para subir imagen y botón de publicar */}
            <div className="flex items-center justify-between">
                {/* Botón de publicar */}
                <PrimaryButton type="submit" text="Publicar"/>
                {/* Área de subida de imagen */}
                <div
                    className="cursor-pointer flex items-center justify-center w-48 h-12 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                    onClick={() => fileInputRef.current.click()}
                >
                    <input
                        type="file"
                        name="image"
                        accept="image/*"
                        onChange={handleFileChange}
                        ref={fileInputRef}
                        style={{ display: "none" }}
                    />
                    {previewUrl ? (
                        <img
                            src={previewUrl}
                            alt="Vista previa"
                            className="w-full h-full object-cover rounded-lg"
                        />
                    ) : (
                        <div className="flex items-center gap-2 text-gray-600">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                fill="none"
                                viewBox="0 0 24 24"
                                strokeWidth="1.5"
                                stroke="currentColor"
                                className="w-6 h-6"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M6.75 7.5l-.662-1.323A2.25 2.25 0 0 0 4.125 5h-1.5A2.25 2.25 0 0 0 .375 7.5v9a2.25 2.25 0 0 0 2.25 2.25h19.5a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 22.125 5h-1.5a2.25 2.25 0 0 0-1.963 1.177L18 7.5M3.75 9.75h16.5M7.5 14.25h9M10.5 11.25h3"
                                />
                            </svg>
                            <span>Subir Imagen</span>
                        </div>
                    )}
                </div>
            </div>
        </form>
    );
};

export default NewPostForm;
