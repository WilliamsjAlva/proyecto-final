// src/pages/NotFound.jsx
import React from "react";
import { Link } from "react-router-dom";
import '../styles/text.css';
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import FormInput from "../components/FormInput"

const NotFound = () => {
    return (
        <div className="flex items-center justify-center min-h-screen text-center">
            <div>
                <h1 className="h1Web">404 - Página no encontrada</h1>
                <p className="pWeb mb-4">Lo siento, la página que buscas no existe.</p>
                <Link to="/home" className="bg-transparent text-[#2f58e0] py-2 px-4 rounded-full border border-[#2f58e0] hover:border-[#3c55b0] active:border-[#273151] cursor-pointer transition">
                    Regresar al inicio
                </Link>
            </div>
        </div>
    );
};

export default NotFound;
