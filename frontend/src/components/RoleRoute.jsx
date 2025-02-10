import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";

const RoleRoute = ({ children, allowedRoles }) => {
    const { auth } = useContext(AuthContext);

    if (!auth) {
        return <Navigate to="/login" replace />;
    }

    if (!allowedRoles.includes(auth.user.role)) {
        return <Navigate to="/unauthorized" replace />;
    }

    return children;
};

export default RoleRoute;
