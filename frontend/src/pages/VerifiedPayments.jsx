/*eslint-disable */
import React, { useState, useEffect } from "react";
import axios from "axios";
import PrimaryButton from "../components/PrimaryButton";
import FormInput from "../components/FormInput";
import SecondaryButton from "../components/SecondaryButton";
import { Link } from 'react-router-dom'; // Importa Link

const VerifiedPayments = () => {
    const [payments, setPayments] = useState([]);
    const [statusFilter, setStatusFilter] = useState("pending");
    const [search, setSearch] = useState("");
    const [page, setPage] = useState(1);
    const [limit] = useState(10);
    const [totalPages, setTotalPages] = useState(1);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    //  Búsqueda avanzada: plan, año o fecha exacta
    const fetchPayments = async () => {
        setLoading(true);
        try {
            const response = await axios.get("http://localhost:5000/api/payments", {
                params: { status: statusFilter, page, limit, search },
            });
            setPayments(response.data.payments || []);
            setTotalPages(response.data.pages || 1);
        } catch (err) {
            console.error(err);
            setError("Error al obtener las solicitudes de pago.");
            setPayments([]);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchPayments();
    }, [page, statusFilter, search]);

    const handleStatusChange = async (paymentId, newStatus) => {
        try {
            await axios.patch(`http://localhost:5000/api/payments/${paymentId}/status`, {
                status: newStatus,
                adminComment: "",
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

    return (
        <div className="container p-4">
            <h2 className="text-2xl font-bold mb-4">Verificación de Pagos</h2>

            {/* Barra de búsqueda mejorada */}
            <div className="mb-4 flex flex-col sm:flex-row items-center justify-between">
                <div>
                    <label className="mr-2">Filtrar por estado:</label>
                    <select
                        value={statusFilter}
                        onChange={(e) => {
                            setStatusFilter(e.target.value);
                            setPage(1);
                        }}
                        className="p-2 border rounded"
                    >
                        <option value="pending">Pendientes</option>
                        <option value="verified">Verificados</option>
                        <option value="rejected">Rechazados</option>
                    </select>
                </div>
                <div className="mt-2 sm:mt-0">
                    <FormInput
                        type="text"
                        placeholder="Buscar por plan, año o fecha (YYYY-MM-DD)"
                        value={search}
                        onChange={handleSearchChange}
                        className="p-2 border rounded"
                    />
                </div>
            </div>

            {error && <p className="text-red-500 mb-4">{error}</p>}
            {loading ? (
                <p>Cargando solicitudes...</p>
            ) : payments.length > 0 ? (
                <table className="min-w-full border-[#CCCCCC] bg-[#FCFCFC]">
                    <thead>
                        <tr>
                            <th className="border p-2">Usuario</th>
                            <th className="border p-2">Plan</th>
                            <th className="border p-2">Monto</th>
                            <th className="border p-2">Fecha</th>
                            <th className="border p-2">Estado</th>
                            <th className="border p-2">Comprobante</th>
                            <th className="border p-2">Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {payments.map((payment) => (
                            <tr key={payment._id}>
                                <td className="border p-2">
                                    {payment.user ? payment.user.username || payment.user.email : "N/A"}
                                </td>
                                <td className="border p-2">{payment.plan?.label || "N/A"}</td>
                                <td className="border p-2">${(payment.plan?.amount / 100).toFixed(2)}</td>
                                <td className="border p-2">
                                    {payment.createdAt ? new Date(payment.createdAt).toLocaleDateString() : "N/A"}
                                </td>
                                <td className="border p-2 capitalize">{payment.status}</td>

                                {/* Imagen del comprobante (solucionado) */}
                                <td className="border p-2">
                                    {payment.screenshotUrl ? (
                                        <Link to={`/admin/uploads/${encodeURIComponent(payment.screenshotUrl)}`} target="_blank" rel="noopener noreferrer">
                                            <img
                                                src={payment.screenshotUrl}
                                                alt="Comprobante de pago"
                                                className="w-24 h-24 object-cover rounded shadow"
                                            />
                                        </Link>
                                    ) : (
                                        <span className="text-gray-500">Sin comprobante</span>
                                    )}
                                </td>

                                <td className="border p-2">
                                    {payment.status === "pending" ? (
                                        <>
                                            <PrimaryButton
                                                onClick={() => handleStatusChange(payment._id, "verified")}
                                                text="Verificar"
                                                className="mr-2"
                                            />
                                            <SecondaryButton
                                                onClick={() => handleStatusChange(payment._id, "rejected")}
                                                text="Rechazar"
                                            />
                                        </>
                                    ) : (
                                        <span>Sin acciones</span>
                                    )}
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>No hay pagos disponibles.</p>
            )}
        </div>
    );
};

export default VerifiedPayments;