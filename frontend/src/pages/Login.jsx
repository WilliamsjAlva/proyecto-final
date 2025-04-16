/* eslint-disable */
import React, { useState, useContext } from "react";
import profileIcon from "../assets/profileIcon.png";
import PrimaryButton from "../components/PrimaryButton";
import FormInput from "../components/FormInput";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { loginUser } from "../api/authService";
import '../styles/text.css';

const Login = () => {
    const [credentials, setCredentials] = useState({
        username: "",
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

            // Si el usuario está baneado y es permanente, bloqueamos el acceso
            if (data.user && data.user.isBanned && data.user.isPermanentBan) {
                setError("Su cuenta ha sido baneada permanentemente.");
                return;
            }

            // Guarda el token y otros datos en el contexto y en el localStorage
            login(data);
            navigate("/home");
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
                <div className="flex justify-center mb-4">
                    <div className="w-24 h-24 flex items-center justify-center">
                        <img src={profileIcon} alt="profile" className="w-24 h-24 rounded-full" />
                    </div>
                </div>
                <h2 className="h2Web text-center mb-2">¡Bienvenido de nuevo!</h2>
                <p className="pWeb text-gray-600 text-center mb-6">¡Ingresa tus datos!</p>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <FormInput
                        type="text"
                        id="username"
                        name="username"
                        placeholder="Nombre de Usuario"
                        onChange={handleChange}
                        required
                        className="pWeb"
                    />
                    <FormInput
                        type="password"
                        id="password"
                        name="password"
                        placeholder="Contraseña"
                        onChange={handleChange}
                        required
                        className="pWeb"
                    />
                    <PrimaryButton text="Iniciar sesión" type="submit" className="pWeb" />
                </form>
            </div>
        </div>
    );
};

export default Login;
