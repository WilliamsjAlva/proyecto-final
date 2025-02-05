// src/pages/Login.jsx
import React, { useState, useContext } from "react";
import profileIcon from "../assets/profileIcon.png";
import PrimaryButton from "../components/PrimaryButton";
import FormInput from "../components/FormInput";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { loginUser } from "../api/authService";

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: "", // Se usa username para login
        password: "",
    });
    const [error, setError] = useState("");
    const navigate = useNavigate();
    const { login } = useContext(AuthContext);

    const handleChange = (e) => {
        setCredentials({ ...credentials, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const data = await loginUser(credentials);
            // Guarda el token y otros datos en el contexto y en el localStorage
            login(data);
            navigate("/home"); // Redirige al dashboard o página principal
        } catch (err) {
            setError(
                err.response?.data?.message
                    ? `${err.response.data.message}. Inténtalo de nuevo más tarde`
                    : "Error al iniciar sesión. Inténtalo de nuevo más tarde"
            );
        }
    };

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="w-full max-w-sm bg-white rounded-2xl shadow-lg p-6">
                {/* Ícono de perfil */}
                <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 flex items-center justify-center">
                        <img src={profileIcon} alt="profile" className="w-24 h-24 rounded-full" />
                    </div>
                </div>
                {/* Mensaje de bienvenida */}
                <h2 className="h2web text-center mb-2">¡Bienvenido de nuevo!</h2>
                <p className="text-sm text-gray-600 text-center mb-6">¡Ingresa tus datos!</p>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {/* Formulario */}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    {/* Campo de Nombre de Usuario */}
                    <FormInput
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Nombre de Usuario"
                        onChange={handleChange}
                        required
                    />
                    {/* Campo de Contraseña */}
                    <FormInput
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Contraseña"
                        onChange={handleChange}
                        required
                    />
                    {/* Recuérdame */}
                    <div className="flex items-center">
                        <input id="remember" type="checkbox" className="h-4 w-4 rounded-full" />
                        <label htmlFor="remember" className="ml-2 text-sm text-gray-700">
                            Recuérdame
                        </label>
                    </div>
                    {/* Botón primario */}
                    <PrimaryButton text="Iniciar sesión" type="submit" />
                </form>
            </div>
        </div>
    );
};

export default Login;
