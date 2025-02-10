import { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import logo from "../assets/Logo.png";

const Navbar = () => {
    const { auth, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate("/home");
    };

    const renderLinks = () => {
        if (!auth) {
            return (
                <>
                    <Link to="/login" className="text-gray-700 hover:text-blue-600">
                        Iniciar sesión
                    </Link>
                    <Link to="/register" className="text-gray-700 hover:text-blue-600">
                        Registrarse
                    </Link>
                </>
            );
        } else {
            const { role } = auth.user;
            let links = [];
            links.push(
                <Link key="dashboard" to="/dashboard" className="text-gray-700 hover:text-blue-600">
                    Dashboard
                </Link>
            );
            if (role === "user") {
                links.push(
                    <Link key="profile" to="/profile" className="text-gray-700 hover:text-blue-600">
                        Mi Perfil
                    </Link>
                );
            } else if (role === "technician") {
                links.push(
                    <Link key="tickets" to="/tickets" className="text-gray-700 hover:text-blue-600">
                        Tickets
                    </Link>,
                    <Link key="profile" to="/profile" className="text-gray-700 hover:text-blue-600">
                        Mi Perfil
                    </Link>
                );
            } else if (role === "moderator") {
                links.push(
                    <Link key="moderate" to="/moderate" className="text-gray-700 hover:text-blue-600">
                        Moderación
                    </Link>,
                    <Link key="profile" to="/profile" className="text-gray-700 hover:text-blue-600">
                        Mi Perfil
                    </Link>
                );
            } else if (role === "admin") {
                links.push(
                    <Link key="admin" to="/admin" className="text-gray-700 hover:text-blue-600">
                        Administración
                    </Link>,
                    <Link key="users" to="/users" className="text-gray-700 hover:text-blue-600">
                        Gestión de Usuarios
                    </Link>
                );
            }
            links.push(
                <button key="logout" onClick={handleLogout} className="text-gray-700 hover:text-blue-600">
                    Cerrar Sesión
                </button>
            );
            return links;
        }
    };

    return (
        <nav className="bg-white shadow-md fixed w-full z-50">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <Link to="/" className="flex items-center">
                    <img src={logo} alt="logo" className="w-32" />
                </Link>
                <div className="hidden md:flex space-x-4">{renderLinks()}</div>
            </div>
        </nav>
    );
};

export default Navbar;
