// frontend/src/pages/ProfileEditor.jsx
import React, { useState, useEffect, useContext } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton";

const ProfileEditor = () => {
    const { auth, logout } = useContext(AuthContext);
    const navigate = useNavigate();
    const userId = auth?.user?.id || auth?.user?._id;

    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        username: "",
        address: "",
        postalCode: "",
        email: "",
        password: "",
    });
    const [loading, setLoading] = useState(false);
    const [loadingData, setLoadingData] = useState(false);
    const [message, setMessage] = useState("");

    useEffect(() => {
        if (!userId) {
            setMessage("Usuario no autenticado.");
            return;
        }
        const fetchUserData = async () => {
            setLoadingData(true);
            try {
                const response = await fetch(`/api/users/${userId}`, {
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                });
                if (response.ok) {
                    const data = await response.json();
                    const dbUser = data.user;
                    setFormData({
                        name: dbUser.name || "",
                        lastName: dbUser.lastName || "",
                        username: dbUser.username || "",
                        address: dbUser.address || "",
                        postalCode: dbUser.postalCode || "",
                        email: dbUser.email || "",
                        password: "",
                    });
                } else {
                    setMessage("Error al cargar los datos del usuario.");
                }
            } catch (error) {
                console.error(error);
                setMessage("Error en la solicitud para cargar los datos.");
            }
            setLoadingData(false);
        };
        fetchUserData();
    }, [userId]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!userId) {
            setMessage("No se puede actualizar el perfil: usuario no autenticado.");
            return;
        }
        setLoading(true);
        setMessage("");
        try {
            const data = new FormData();
            for (const key in formData) {
                data.append(key, formData[key]);
            }

            const response = await fetch(`/api/users/${userId}`, {
                method: "PUT",
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
                body: data,
            });
            const dataResponse = await response.json();
            if (response.ok) {
                setMessage("Perfil actualizado correctamente. Se cerrará la sesión para aplicar los cambios.");
                setTimeout(() => {
                    logout();
                    navigate("/login");
                }, 2000);
            } else {
                setMessage(dataResponse.message || "Error al actualizar el perfil.");
            }
        } catch (error) {
            console.error(error);
            setMessage("Error en la solicitud.");
        }
        setLoading(false);
    };

    if (loadingData) {
        return (
            <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
                <p>Cargando datos...</p>
            </div>
        );
    }

    return (
        <div className="max-w-md mx-auto mt-10 p-6 bg-white shadow-md rounded-md">
            <h2 className="text-2xl font-bold mb-4">Editar Perfil</h2>
            {message && message !== "Perfil actualizado correctamente. Se cerrará la sesión para aplicar los cambios." && ( // Message except success
                <div className="mb-4 text-center text-red-600">{message}</div> // Changed to red for errors
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-gray-700">Nombre</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Apellido</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Nombre de Usuario</label>
                    <input
                        type="text"
                        name="username"
                        value={formData.username}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Dirección</label>
                    <input
                        type="text"
                        name="address"
                        value={formData.address}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Código Postal</label>
                    <input
                        type="text"
                        name="postalCode"
                        value={formData.postalCode}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Email</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        required
                    />
                </div>
                <div>
                    <label className="block text-gray-700">Nueva Contraseña</label>
                    <input
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        className="w-full border border-gray-300 p-2 rounded"
                        placeholder="Dejar en blanco para mantener la actual"
                    />
                </div>

                <PrimaryButton
                    type="submit"
                    text="Guardar Cambios"
                    className="w-full bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
                    disabled={loading}
                >
                    {loading ? "Actualizando..." : "Actualizar Perfil"}
                </PrimaryButton>
                {message === "Perfil actualizado correctamente. Se cerrará la sesión para aplicar los cambios." && ( // Success message
                    <div className="mt-4 text-center text-green-600">{message}</div>
                )}
            </form>
        </div>
    );
};

export default ProfileEditor;