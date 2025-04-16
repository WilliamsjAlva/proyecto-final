// src/pages/AdminPayments.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";

const AdminPayments = () => {
    const [payments, setPayments] = useState([]);
    const [total, setTotal] = useState(0);
    const [page, setPage] = useState(1);
    const [pages, setPages] = useState(1);
    const [statusFilter, setStatusFilter] = useState("pending"); // Estado por defecto: pendientes
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    // Función para obtener la lista de pagos desde el backend
    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5000/api/payments", {
                params: {
                    status: statusFilter,
                    page,
                    limit: 10,
                    search,
                },
            });
            setPayments(response.data.payments);
            setTotal(response.data.total);
            setPages(response.data.pages);
        } catch (err) {
            console.error(err);
            setError("Error al obtener las solicitudes de pago.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPayments();
        // eslint-disable-next-line
    }, [page, statusFilter, search]);

    // Función para actualizar el estado del pago
    const handleStatusChange = async (paymentId, newStatus) => {
        try {
            await axios.patch(`http://localhost:5000/api/payments/${paymentId}/status`, {
                status: newStatus,
                adminComment: "", // Se puede extender para incluir comentarios
            });
            fetchPayments();
        } catch (err) {
            console.error(err);
            setError("Error al actualizar el estado del pago.");
        }
    };

    const handleSearchChange = (e) => {
        setSearch(e.target.value);
        setPage(1);
    };

    const handlePageChange = (newPage) => {
        if (newPage >= 1 && newPage <= pages) {
            setPage(newPage);
        }
    };

    return (
        <div className="p-4">
            <h2 className="text-2xl font-bold mb-4">Verificación de Pagos</h2>

            <div className="mb-4 flex flex-col sm:flex-row items-center justify-between">
                <div>
                    <label className="mr-2">Filtrar por estado:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="border p-1"
                    >
                        <option value="pending">Pendientes</option>
                        <option value="verified">Verificados</option>
                        <option value="rejected">Rechazados</option>
                    </select>
                </div>
                <div className="mt-2 sm:mt-0">
                    <input
                        type="text"
                        placeholder="Buscar por plan"
                        value={search}
                        onChange={handleSearchChange}
                        className="border p-1"
                    />
                </div>
            </div>

            {loading ? (
                <p>Cargando...</p>
            ) : error ? (
                <p className="text-red-500">{error}</p>
            ) : (
                <>
                    <table className="min-w-full border">
                        <thead>
                            <tr>
                                <th className="border p-2">Usuario</th>
                                <th className="border p-2">Plan</th>
                                <th className="border p-2">Monto</th>
                                <th className="border p-2">Fecha</th>
                                <th className="border p-2">Estado</th>
                                <th className="border p-2">Acciones</th>
                            </tr>
                        </thead>
                        <tbody>
                            {payments.map((payment) => (
                                <tr key={payment._id}>
                                    <td className="border p-2">
                                        {payment.user ? payment.user.username || payment.user.email : "N/A"}
                                    </td>
                                    <td className="border p-2">{payment.plan.label}</td>
                                    <td className="border p-2">${(payment.plan.amount / 100).toFixed(2)}</td>
                                    <td className="border p-2">{new Date(payment.createdAt).toLocaleDateString()}</td>
                                    <td className="border p-2 capitalize">{payment.status}</td>
                                    <td className="border p-2">
                                        {payment.status === "pending" && (
                                            <>
                                                <button
                                                    onClick={() => handleStatusChange(payment._id, "verified")}
                                                    className="bg-green-500 text-white px-2 py-1 mr-2 rounded"
                                                >
                                                    Verificar
                                                </button>
                                                <button
                                                    onClick={() => handleStatusChange(payment._id, "rejected")}
                                                    className="bg-red-500 text-white px-2 py-1 rounded"
                                                >
                                                    Rechazar
                                                </button>
                                            </>
                                        )}
                                        {payment.status !== "pending" && <span>Sin acciones</span>}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>

                    <div className="mt-4 flex justify-center items-center">
                        <button
                            onClick={() => handlePageChange(page - 1)}
                            disabled={page === 1}
                            className="px-2 py-1 border mr-2"
                        >
                            Anterior
                        </button>
                        <span className="px-2 py-1">
                            Página {page} de {pages}
                        </span>
                        <button
                            onClick={() => handlePageChange(page + 1)}
                            disabled={page === pages}
                            className="px-2 py-1 border ml-2"
                        >
                            Siguiente
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default AdminPayments;
