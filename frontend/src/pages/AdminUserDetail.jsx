/* eslint-disable */
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/text.css";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import FormInput from "../components/FormInput";

const AdminUserDetail = () => {
    const { id } = useParams();
    const { auth } = useContext(AuthContext);
    const [user, setUser] = useState(null);
    const [error, setError] = useState("");
    const [successMessage, setSuccessMessage] = useState("");
    const [selectedPlan, setSelectedPlan] = useState(null);
    const [editedData, setEditedData] = useState({
        name: "",
        lastName: "",
        address: "",
        postalCode: "",
        role: "user",
        password: "",
        isBanned: false,
        banExpiration: "",
        banReason: "",
        isPremium: false,
        premiumExpiry: "",
    });
    const navigate = useNavigate();

    const loadUser = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/users/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setUser(response.data.user);
            setEditedData({
                name: response.data.user.name || "",
                lastName: response.data.user.lastName || "",
                address: response.data.user.address || "",
                postalCode: response.data.user.postalCode || "",
                role: response.data.user.role || "user",
                password: "",
                isBanned: response.data.user.isBanned || false,
                banExpiration: response.data.user.banExpiration
                    ? new Date(response.data.user.banExpiration).toISOString().slice(0, 16)
                    : "",
                banReason: response.data.user.banReason || "",
                isPremium: response.data.user.isPremium || false,
                premiumExpiry: response.data.user.premiumExpiry
                    ? new Date(response.data.user.premiumExpiry).toISOString().slice(0, 16)
                    : "",
            });
            if (response.data.user.isPremium && response.data.user.premiumExpiry) {
                setSelectedPlan(null);
            }
        } catch (err) {
            console.error(err);
            setError("Error al cargar usuario. Inténtalo de nuevo más tarde.");
        }
    };

    useEffect(() => {
        loadUser();
    }, [id, auth.token]);

    // Función para seleccionar un plan Premium basado en la cantidad de días
    const handleSelectPlan = (days) => {
        setSelectedPlan(days.toString());
        const expiryDate = new Date(Date.now() + days * 24 * 60 * 60 * 1000);
        const formatted = expiryDate.toISOString().slice(0, 16);
        setEditedData((prev) => ({ ...prev, premiumExpiry: formatted }));
    };

    // Calcula los días restantes de la suscripción premium
    const getRemainingDays = () => {
        if (!editedData.premiumExpiry) return null;
        const expiry = new Date(editedData.premiumExpiry);
        const now = new Date();
        const diffMs = expiry - now;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    // Calcula los días restantes del baneo (si se define una fecha)
    const getRemainingBanDays = () => {
        if (!editedData.banExpiration) return null;
        const expiry = new Date(editedData.banExpiration);
        const now = new Date();
        const diffMs = expiry - now;
        const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
        return diffDays > 0 ? diffDays : 0;
    };

    // Función para establecer ban permanente (sin fecha de expiración)
    const handlePermanentBan = () => {
        setEditedData((prev) => ({ ...prev, banExpiration: "" }));
    };

    const handleSave = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(`http://localhost:5000/api/users/${id}`, editedData, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setUser(response.data.user);
            setEditedData((prev) => ({ ...prev, password: "" }));
            setSuccessMessage("Cambios guardados exitosamente");
            setTimeout(() => setSuccessMessage(""), 3000);
        } catch (err) {
            console.error(err);
            setError("Error al actualizar usuario. Inténtalo de nuevo más tarde.");
        }
    };

    if (!user)
        return (
            <div className="container mx-auto p-4">
                {error || "Cargando usuario..."}
            </div>
        );

    return (
        <div className="container mx-auto p-4 pl-20 pr-20">
            <SecondaryButton
                onClick={() => navigate(-1)}
                text="Atrás"
                className="mb-4 px-4 py-2"
            />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <h1 className="h1Web font-bold mb-4">Detalle de Usuario</h1>
            <form onSubmit={handleSave} className="space-y-4">
                <div>
                    <label className="pWeb">Nombre:</label>
                    <FormInput
                        type="text"
                        value={editedData.name}
                        onChange={(e) =>
                            setEditedData({ ...editedData, name: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="pWeb">Apellido:</label>
                    <FormInput
                        type="text"
                        value={editedData.lastName}
                        onChange={(e) =>
                            setEditedData({ ...editedData, lastName: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                        required
                    />
                </div>
                <div>
                    <label className="pWeb">Username:</label>
                    <p className="pWeb p-2 block w-full rounded-full border border-gray-300 shadow-sm bg-gray-200">
                        {user.username}
                    </p>
                </div>
                <div>
                    <label className="block font-bold">Email:</label>
                    <p className="pWeb p-2 block w-full rounded-full border border-gray-300 shadow-sm bg-gray-200">
                        {user.email}
                    </p>
                </div>
                <div>
                    <label className="block font-bold">Dirección:</label>
                    <FormInput
                        type="text"
                        value={editedData.address}
                        onChange={(e) =>
                            setEditedData({ ...editedData, address: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block font-bold">Código Postal:</label>
                    <FormInput
                        type="text"
                        value={editedData.postalCode}
                        onChange={(e) =>
                            setEditedData({ ...editedData, postalCode: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                    />
                </div>
                <div>
                    <label className="block font-bold">Rol:</label>
                    <select
                        value={editedData.role}
                        onChange={(e) =>
                            setEditedData({ ...editedData, role: e.target.value })
                        }
                        className="pWeb p-2 block w-full rounded-full border border-gray-300 shadow-sm"
                    >
                        <option value="user">Usuario Standard</option>
                        <option value="technician">Técnico</option>
                        <option value="moderator">Moderador</option>
                        <option value="admin">Administrador</option>
                    </select>
                </div>
                <div>
                    <label className="pWeb">Contraseña:</label>
                    <FormInput
                        type="password"
                        value={editedData.password}
                        onChange={(e) =>
                            setEditedData({ ...editedData, password: e.target.value })
                        }
                        className="w-full p-2 border rounded"
                        placeholder="Dejar en blanco para no cambiar"
                    />
                </div>
                <div>
                    <label className="pWeb">Baneado:</label>
                    <select
                        value={editedData.isBanned ? "true" : "false"}
                        onChange={(e) =>
                            setEditedData({
                                ...editedData,
                                isBanned: e.target.value === "true",
                            })
                        }
                        className="pWeb p-2 block w-full rounded-full border border-gray-300 shadow-sm"
                    >
                        <option value="false">No</option>
                        <option value="true">Sí</option>
                    </select>
                </div>
                {editedData.isBanned && (
                    <>
                        <div>
                            <label className="pWeb">
                                Fecha de Expiración del Ban (vacío para ban permanente):
                            </label>
                            <div className="flex items-center space-x-2">
                                <FormInput
                                    type="datetime-local"
                                    value={editedData.banExpiration}
                                    onChange={(e) =>
                                        setEditedData({
                                            ...editedData,
                                            banExpiration: e.target.value,
                                        })
                                    }
                                    className="w-full p-2 border rounded"
                                />
                            </div>
{/*                           <button
                                type="button"
                                onClick={handlePermanentBan}
                                className="px-2 py-1 bg-red-500 text-white rounded"
                            >
                                PermaBan ⚠️
                            </button>
                            */} 
                            {editedData.banExpiration ? (
                                <p className="mt-2 text-sm text-gray-600">
                                    Expira: {editedData.banExpiration.replace("T", " ")} (
                                    {getRemainingBanDays()} días restantes)
                                </p>
                            ) : (
                                <p className="mt-2 text-sm text-gray-600">Ban Permanente</p>
                            )}
                        </div>
                        <div>
                            <label className="pWeb">Razón del Ban:</label>
                            <FormInput
                                type="text"
                                value={editedData.banReason}
                                onChange={(e) =>
                                    setEditedData({ ...editedData, banReason: e.target.value })
                                }
                                className="w-full p-2 border rounded"
                                placeholder="Motivo del baneo"
                            />
                        </div>
                    </>
                )}
                <div>
                    <label className="pWeb">Usuario Premium:</label>
                    <select
                        value={editedData.isPremium ? "true" : "false"}
                        onChange={(e) => {
                            const isPremium = e.target.value === "true";
                            setEditedData((prev) => ({
                                ...prev,
                                isPremium,
                                premiumExpiry: isPremium
                                    ? new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
                                        .toISOString()
                                        .slice(0, 16)
                                    : "",
                            }));
                            if (isPremium) setSelectedPlan("30");
                            else setSelectedPlan(null);
                        }}
                        className="pWeb p-2 block w-full rounded-full border border-gray-300 shadow-sm"
                    >
                        <option value="false">No</option>
                        <option value="true">Sí</option>
                    </select>
                </div>
                {editedData.isPremium && (
                    <div>
                        <label className="pWeb block mb-2">Selecciona un plan Premium:</label>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <div
                                onClick={() => handleSelectPlan(30)}
                                className={`cursor-pointer p-4 border rounded text-center ${selectedPlan === "30"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100"
                                    }`}
                            >
                                <h2 className="font-bold">1 Mes</h2>
                                <p>30 días</p>
                            </div>
                            <div
                                onClick={() => handleSelectPlan(90)}
                                className={`cursor-pointer p-4 border rounded text-center ${selectedPlan === "90"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100"
                                    }`}
                            >
                                <h2 className="font-bold">3 Meses</h2>
                                <p>90 días</p>
                            </div>
                            <div
                                onClick={() => handleSelectPlan(180)}
                                className={`cursor-pointer p-4 border rounded text-center ${selectedPlan === "180"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100"
                                    }`}
                            >
                                <h2 className="font-bold">6 Meses</h2>
                                <p>180 días</p>
                            </div>
                            <div
                                onClick={() => handleSelectPlan(365)}
                                className={`cursor-pointer p-4 border rounded text-center ${selectedPlan === "365"
                                    ? "bg-blue-500 text-white"
                                    : "bg-gray-100"
                                    }`}
                            >
                                <h2 className="font-bold">1 Año</h2>
                                <p>365 días</p>
                            </div>
                        </div>
                        {editedData.premiumExpiry && (
                            <p className="mt-2 text-sm text-gray-600">
                                Expira: {editedData.premiumExpiry.replace("T", " ")} (
                                {getRemainingDays()} días restantes)
                            </p>
                        )}
                    </div>
                )}
                <div>
                    <PrimaryButton
                        text="Guardar Cambios"
                        type="submit"
                        className="px-4 py-2"
                    />
                </div>
            </form>
            {successMessage && (
                <p className="mt-4 text-green-600">{successMessage}</p>
            )}
        </div>
    );
};

export default AdminUserDetail;
