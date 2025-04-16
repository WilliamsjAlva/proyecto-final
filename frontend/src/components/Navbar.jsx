import { useState, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import logo from "../assets/Logo.png";
import logoPremium from "../assets/LogoPremium.png";
import SearchBar from "./SearchBar";

const Navbar = () => {
    const { auth, logout } = useContext(AuthContext);
    const navigate = useNavigate();

    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

    const handleLogout = () => {
        logout();
        navigate("/home");
    };

    const handleUserMenuToggle = () => {
        setIsUserMenuOpen(!isUserMenuOpen);
    };

    const renderPublicLinks = () => (
        <>
            <Link to="/login" className="block py-2 px-3 text-gray-700 hover:text-blue-600">
                Iniciar sesión
            </Link>
            <Link to="/register" className="block py-2 px-3 text-gray-700 hover:text-blue-600">
                Registrarse
            </Link>
        </>
    );

    const renderAuthenticatedTopLinks = () => (
        <>
            <Link to="/feed" className="pWeb block py-2 px-3 text-gray-700 hover:text-blue-600">
                Feed
            </Link>
            <Link to="/notifications" className="pWeb block py-2 px-3 text-gray-700 hover:text-blue-600">
                Notificaciones
            </Link>
        </>
    );

    // Menú de usuario para escritorio (dropdown)
    const renderUserMenu = () => {
        if (!auth) return null;

        const { role, isPremium, premiumExpiry } = auth.user;
        const allowedRoles = ["admin", "moderator", "technician"];

        let premiumDisplay;
        if (isPremium && premiumExpiry) {
            const now = new Date();
            const expiry = new Date(premiumExpiry);
            const diffMs = expiry - now;
            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
            premiumDisplay = (
                <div className="px-4 py-2 text-yellow-500 font-semibold">
                    Premium ({diffDays} {diffDays !== 1 ? "días" : "día"} restantes)
                </div>
            );
        } else {
            premiumDisplay = (
                <Link to="/premiumplans" className="block px-4 py-2 hover:bg-gray-100">
                    Activar Premium
                </Link>
            );
        }

        return (
            <div className="relative">
                <button
                    onClick={handleUserMenuToggle}
                    className="flex items-center space-x-2 py-2 px-3 text-gray-700 hover:text-blue-600 focus:outline-none"
                >
                    <span className="pWeb">Menu</span>
                    <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className={`h-5 w-5 transform transition-transform ${isUserMenuOpen ? "rotate-180" : "rotate-0"}`}
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                    >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                </button>

                {isUserMenuOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-white border border-gray-300 rounded shadow-md z-50">
                        {premiumDisplay}
                        {role === "technician" && (
                            <Link to="/tickets" className="block px-4 py-2 hover:bg-gray-100">
                                Tickets
                            </Link>
                        )}
                        {role === "moderator" && (
                            <Link to="/moderate" className="block px-4 py-2 hover:bg-gray-100">
                                Moderación
                            </Link>
                        )}
                        {role === "admin" && (
                            <Link to="/admin/dashboard" className="block px-4 py-2 hover:bg-gray-100">
                                Gestión de Usuarios
                            </Link>
                        )}
                        <Link to="/profile" className="block px-4 py-2 hover:bg-gray-100">
                            Mi Perfil
                        </Link>
                        {(allowedRoles.includes(role) || isPremium) && (
                            <Link to="/premium-chat" className="block px-4 py-2 hover:bg-gray-100">
                                Chat Premium
                            </Link>
                        )}
                        <button
                            onClick={handleLogout}
                            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
                        >
                            Cerrar Sesión
                        </button>
                    </div>
                )}
            </div>
        );
    };

    return (
        <nav className="bg-white shadow-md fixed w-full z-50">
            <div className="container mx-auto px-4 py-4 flex items-center justify-between">
                <div className="flex items-center space-x-4">
                    <Link to="/">
                        <img
                            src={auth && auth.user && auth.user.isPremium ? logoPremium : logo}
                            alt="logo"
                            className="w-32"
                        />
                    </Link>
                    {auth && (
                        <div className="hidden md:block">
                            <SearchBar />
                        </div>
                    )}
                </div>

                {/* Menú de PC */}
                <div className="hidden md:flex items-center space-x-1">
                    {auth ? (
                        <>
                            {renderAuthenticatedTopLinks()}
                            {renderUserMenu()}
                        </>
                    ) : (
                        renderPublicLinks()
                    )}
                </div>

                {/* Menú Burger Mobile */}
                <div className="md:hidden">
                    <button
                        onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                        className="text-gray-700 hover:text-blue-600 focus:outline-none"
                    >
                        <svg
                            xmlns="http://www.w3.org/2000/svg"
                            className="h-6 w-6"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            {isMobileMenuOpen ? (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                            ) : (
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                            )}
                        </svg>
                    </button>
                </div>
            </div>

            {isMobileMenuOpen && (
                <div className="md:hidden bg-white shadow-md">
                    <div className="container mx-auto px-4 py-2">
                        {auth && <SearchBar />}
                        <div className="mt-2">
                            {auth ? (
                                <>
                                    {renderAuthenticatedTopLinks()}
                                    {(() => {
                                        // Renderizamos directamente las rutas en móvil, sin dropdown
                                        const { role, isPremium, premiumExpiry } = auth.user;
                                        const allowedRoles = ["admin", "moderator", "technician"];
                                        let premiumDisplay;
                                        if (isPremium && premiumExpiry) {
                                            const now = new Date();
                                            const expiry = new Date(premiumExpiry);
                                            const diffMs = expiry - now;
                                            const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
                                            premiumDisplay = (
                                                <div className="block py-2 px-3 text-yellow-500 font-semibold">
                                                    Premium ({diffDays} {diffDays !== 1 ? "días" : "día"} restantes)
                                                </div>
                                            );
                                        } else {
                                            premiumDisplay = (
                                                <Link
                                                    to="/premiumplans"
                                                    className="block py-2 px-3 text-gray-700 hover:text-blue-600"
                                                >
                                                    Activar Premium
                                                </Link>
                                            );
                                        }
                                        return (
                                            <>
                                                {premiumDisplay}
                                                {role === "technician" && (
                                                    <Link
                                                        to="/tickets"
                                                        className="block py-2 px-3 text-gray-700 hover:text-blue-600"
                                                    >
                                                        Tickets
                                                    </Link>
                                                )}
                                                {role === "moderator" && (
                                                    <Link
                                                        to="/moderate"
                                                        className="block py-2 px-3 text-gray-700 hover:text-blue-600"
                                                    >
                                                        Moderación
                                                    </Link>
                                                )}
                                                {role === "admin" && (
                                                    <Link
                                                        to="/admin/dashboard"
                                                        className="block py-2 px-3 text-gray-700 hover:text-blue-600"
                                                    >
                                                        Gestión de Usuarios
                                                    </Link>
                                                )}
                                                <Link
                                                    to="/profile"
                                                    className="block py-2 px-3 text-gray-700 hover:text-blue-600"
                                                >
                                                    Mi Perfil
                                                </Link>
                                                {(allowedRoles.includes(role) || isPremium) && (
                                                    <Link
                                                        to="/premium-chat"
                                                        className="block py-2 px-3 text-gray-700 hover:text-blue-600"
                                                    >
                                                        Chat Premium
                                                    </Link>
                                                )}
                                                <button
                                                    onClick={handleLogout}
                                                    className="block py-2 px-3 text-gray-700 hover:text-blue-600"
                                                >
                                                    Cerrar Sesión
                                                </button>
                                            </>
                                        );
                                    })()}
                                </>
                            ) : (
                                renderPublicLinks()
                            )}
                        </div>
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
