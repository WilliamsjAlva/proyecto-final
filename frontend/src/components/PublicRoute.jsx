// frontend/src/components/PublicRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";

const PublicRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);

    // Si el usuario ya está autenticado, redirigimos a la ruta deseada.
    if (auth) {
        return <Navigate to="/feed" replace />;
    }

    // Si no está autenticado, mostramos la página (login o register)
    return children;
};

export default PublicRoute;
