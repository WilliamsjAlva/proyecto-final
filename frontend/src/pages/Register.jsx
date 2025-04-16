/* eslint-disable */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/authService";
import FormInput from "../components/FormInput";
import profileIcon from "../assets/profileIcon.png";
import PrimaryButton from "../components/PrimaryButton";
import '../styles/text.css';

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
            console.log("Enviando datos de registro:", formData);
            const result = await registerUser(formData);
            console.log("Registro exitoso:", result);
            // Si el registro es exitoso, redirigimos a la página de login
            navigate("/login");
        } catch (err) {
            console.error("Error en el registro:", err);
            setError(
                err.response?.data?.message
                    ? `${err.response.data.message}. Inténtalo de nuevo más tarde`
                    : "Error en el registro. Inténtalo de nuevo más tarde"
            );
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="max-w-md w-full bg-white rounded-lg p-6">
                <div className="flex flex-col items-center">
                    <div className="flex justify-center mb-4">
                        <div className="w-24 h-24 flex items-center justify-center">
                            <img src={profileIcon} alt="profile" className="w-24 h-24 rounded-full" />
                        </div>
                    </div>
                    <h1 className="h2Web text-gray-700 mb-2">¡Bienvenido!</h1>
                    <p className="pWeb text-gray-500 mb-6">¡Vamos a registrarte!</p>
                </div>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                <form className="space-y-4" onSubmit={handleSubmit}>
                    <FormInput
                        type="text"
                        name="name"
                        placeholder="Nombre"
                        onChange={handleChange}
                        required
                        className="pWeb"
                    />
                    <FormInput
                        type="text"
                        name="lastName"
                        placeholder="Apellido"
                        onChange={handleChange}
                        required
                        className="pWeb"
                    />
                    <FormInput
                        type="text"
                        name="username"
                        placeholder="Nombre de Usuario"
                        onChange={handleChange}
                        required
                        className="pWeb"
                    />
                    <FormInput
                        type="text"
                        name="address"
                        placeholder="Dirección"
                        onChange={handleChange}
                        required
                        className="pWeb"
                    />
                    <FormInput
                        type="text"
                        name="postalCode"
                        placeholder="Código Postal"
                        onChange={handleChange}
                        required
                        className="pWeb"
                    />
                    <FormInput
                        type="email"
                        name="email"
                        placeholder="Email"
                        onChange={handleChange}
                        required
                        className="pWeb"
                    />
                    <div className="relative">
                        <FormInput
                            type="password"
                            name="password"
                            placeholder="Contraseña"
                            onChange={handleChange}
                            required
                        />
                    </div>
                    <p className="text-xs pWeb text-gray-400 text-center">
                        Al registrarme estoy aceptando los{" "}
                        <a href="#" className="text-blue-500 underline">
                            términos y condiciones
                        </a>{" "}
                        de la plataforma
                    </p>
                    <PrimaryButton
                        type="submit"
                        className="pWeb"
                        text="Registrarse"
                    />
                </form>
            </div>
        </div>
    );
};

export default Register;
