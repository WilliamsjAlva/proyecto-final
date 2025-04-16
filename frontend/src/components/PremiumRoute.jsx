// src/components/PremiumRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";

const PremiumRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);

    // Si el usuario no está autenticado, redirige al login
    if (!auth) {
        return <Navigate to="/login" replace />;
    }

    // Definir los roles que tienen acceso sin ser premium
    const allowedRoles = ["admin", "technician", "moderator"];

    // Se permite el acceso si el usuario es premium o tiene alguno de los roles autorizados
    if (auth.user.isPremium || allowedRoles.includes(auth.user.role)) {
        return children;
    }

    // Si no cumple la condición, redirige a la página de no autorizado
    return <Navigate to="/unauthorized" replace />;
};

export default PremiumRoute;