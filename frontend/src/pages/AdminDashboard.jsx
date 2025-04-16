/* eslint-disable */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import '../styles/text.css'; // Asegúrate de que este archivo también esté adaptado a Tailwind
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import FormInput from "../components/FormInput";

const AdminDashboard = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [users, setUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const loadUsers = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:5000/api/users?search=${encodeURIComponent(
                    searchTerm
                )}&page=${page}&limit=${limit}`,
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            setUsers(response.data.users);
            setTotalPages(response.data.totalPages);
        } catch (err) {
            console.error(err);
            setError("Error al cargar usuarios. Inténtalo de nuevo más tarde.");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadUsers();
    }, [page, auth.token]);

    const handleSearch = () => {
        setPage(1);
        loadUsers();
    };

    const handleUserClick = (userId) => {
        navigate(`/admin/user/${userId}`);
    };

    const goToVerifyPayments = () => {
        navigate("/admin/verifiedpayments");
    };

    const renderPagination = () => {
        if (totalPages <= 1) return null;

        const blockSize = 10;
        const currentBlock = Math.floor((page - 1) / blockSize);
        const startPage = currentBlock * blockSize + 1;
        const endPage = Math.min(totalPages, (currentBlock + 1) * blockSize);

        return (
            <div className="flex justify-center items-center space-x-2 mt-4">
                {currentBlock > 0 && (
                    <button
                        onClick={() => setPage(startPage - 1)}
                        className="px-3 py-1 border rounded cursor-pointer bg-white text-blue-600 hover:bg-blue-100"
                    >
                        Anterior
                    </button>
                )}
                {Array.from({ length: endPage - startPage + 1 }, (_, i) => {
                    const currentNumber = startPage + i;
                    return (
                        <button
                            key={currentNumber}
                            onClick={() => setPage(currentNumber)}
                            className={`px-3 py-1 border rounded cursor-pointer ${page === currentNumber
                                ? "bg-blue-600 text-white"
                                : "bg-white text-blue-600 hover:bg-blue-100"
                                }`}
                        >
                            {currentNumber}
                        </button>
                    );
                })}
                {(currentBlock + 1) * blockSize < totalPages && (
                    <button
                        onClick={() => setPage(endPage + 1)}
                        className="px-3 py-1 cursor-pointer border rounded bg-white text-blue-600 hover:bg-blue-100"
                    >
                        Siguiente
                    </button>
                )}
            </div>
        );
    };

    return (
        <div className="container p-4 pl-20 pr-20">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Dashboard de Administrador</h1>
                <PrimaryButton
                    onClick={goToVerifyPayments}
                    text="Verificar Pagos"
                    className="py-2 px-4"
                />
            </div>
            <div className="mb-6 flex gap-2">
                <FormInput
                    type="text"
                    placeholder="Buscar usuarios..."
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        setPage(1);
                    }}
                    className="w-full p-2 border border-gray-300 bg-gray-50 rounded-full"
                />
                <PrimaryButton
                    onClick={handleSearch}
                    text="Buscar"
                    className="py-2 px-4"
                />
            </div>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                {users.map((user) => (
                    <div
                        key={user._id}
                        onClick={() => handleUserClick(user._id)}
                        className="p-4 border border-gray-300 bg-gray-50 hover:rounded-2xl transition-all rounded mb-4 cursor-pointer"
                    >
                        <p className="font-semibold">
                            {user.username} {user.isBanned && <span className="text-red-500">(BANEADO)</span>}
                        </p>
                        <p className="text-gray-600">{user.email}</p>
                        <p className="text-gray-600">Rol: {user.role}</p>
                    </div>
                ))}
            </div>
            {loading && <p className="mt-4 text-gray-600">Cargando usuarios...</p>}
            {renderPagination()}
        </div>
    );
};

export default AdminDashboard;