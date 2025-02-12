import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authService";

const Register = () => {
    const [formData, setFormData] = useState({
        name: "",
        lastName: "",
        username: "",
        address: "",
        postalCode: "",
        email: "",
        password: "",
        profilePicture: ""
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await registerUser(formData);
            navigate("/login");
        } catch (err) {
            setError(
                err.response?.data?.message
                    ? `${err.response.data.message}. Inténtalo de nuevo más tarde`
                    : "Error en el registro. Inténtalo de nuevo más tarde"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white shadow-md rounded-lg p-6">
                <div className="flex flex-col items-center">
                    <div className="mb-4">
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-16 w-16 text-gray-500"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 11c2.485 0 4.5-2.015 4.5-4.5S14.485 2 12 2 7.5 4.015 7.5 6.5 9.515 11 12 11zM12 13c-4.418 0-8 1.79-8 4v1h16v-1c0-2.21-3.582-4-8-4z"
                            />
                        </svg>
                    </div>
                    <h1 className="text-2xl font-bold text-gray-700 mb-2">¡Bienvenido!</h1>
                    <p className="text-sm text-gray-500 mb-6">¡Vamos a registrarte!</p>
                </div>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <input
                        type="text"
                        name="name"
                        placeholder="Nombre"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="lastName"
                        placeholder="Apellido"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="username"
                        placeholder="Nombre de Usuario"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="address"
                        placeholder="Dirección"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="text"
                        name="postalCode"
                        placeholder="Código Postal"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                        required
                    />
                    <input
                        type="email"
                        name="email"
                        placeholder="Email"
                        className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        onChange={handleChange}
                        required
                    />
                    <div className="relative">
                        <input
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            className="w-full p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            onChange={handleChange}
                            required
                        />
                        <div className="absolute inset-y-0 right-3 flex items-center">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="h-5 w-5 text-gray-400"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                                />
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.477 0 8.268 2.943 9.542 7-.558 2.086-2.062 3.856-4.042 4.728M2.458 12c1.118 3.157 4.288 5 7.542 5 1.97 0 3.774-.665 5.2-1.775"
                                />
                            </svg>
                        </div>
                    </div>
                    <p className="text-xs text-gray-400 text-center">
                        Al registrarme estoy aceptando los{" "}
                        <a href="#" className="text-blue-500 underline">
                            términos y condiciones
                        </a>{" "}
                        de la plataforma
                    </p>
                    <button
                        type="submit"
                        className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition"
                    >
                        ¡Regístrame, vamos!
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Register;
