// src/components/RoleRoute.jsx
import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";

const RoleRoute = ({ children, allowedRoles }) => {
    const { auth } = useContext(AuthContext);

    if (!auth) {
        // Si no está autenticado, redirige al login
        return <Navigate to="/login" replace />;
    }

    // Si el rol del usuario no está permitido, redirige a una ruta no autorizada o a dashboard
    if (!allowedRoles.includes(auth.user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default RoleRoute;
