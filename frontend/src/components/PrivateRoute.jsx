import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";

const PrivateRoute = ({ children }) => {
    const { auth } = useContext(AuthContext);
    if (!auth) {
        return <Navigate to="/login" replace />;
    }
    return children;
};

export default PrivateRoute;
