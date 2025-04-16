import React, { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { uploadScreenshot, createPaymentRequest } from "../services/paymentService";
import { useAuth } from "../contexts/AuthContext";

const PaymentForm = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const { auth } = useAuth();
    const plan = location.state || {};

    const [file, setFile] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (e) => {
        setFile(e.target.files[0]);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!file) {
            setError("Por favor, selecciona un comprobante.");
            return;
        }

        if (!auth?.user?._id) {
            setError("Error: No se encontró el usuario autenticado.");
            console.error("Usuario no encontrado en el contexto de autenticación:", auth);
            return;
        }

        setLoading(true);
        try {
            const uploadRes = await uploadScreenshot(file);
            const screenshotUrl = uploadRes.screenshotUrl;

            const data = {
                user: auth.user._id,
                plan,
                screenshotUrl,
            };

            console.log("Enviando solicitud de pago con datos:", data);
            await createPaymentRequest(data);
            setLoading(false);
            navigate("/payment-success");
        } catch (err) {
            console.error("Error enviando la solicitud de pago:", err);
            setError("Error al enviar la solicitud de pago.");
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-gray-100 py-6 flex flex-col justify-center sm:py-12">
            <div className="relative py-3 sm:max-w-xl sm:mx-auto">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-300 to-blue-600 shadow-lg transform -skew-y-6 sm:skew-y-0 sm:-rotate-6 sm:rounded-3xl"></div>
                <div className="relative px-4 py-10 bg-white shadow-lg sm:rounded-3xl sm:p-20">
                    <h2 className="text-2xl font-semibold text-center text-gray-800 mb-8">
                        Subir Comprobante de Pago
                    </h2>
                    {plan?.label && plan?.price ? (
                        <p className="mb-6 text-center text-gray-600">
                            Plan seleccionado: <span className="font-semibold">{plan.label}</span> - ${plan.price}
                        </p>
                    ) : (
                        <p className="text-red-500 text-center mb-6">No se ha seleccionado un plan.</p>
                    )}

                    {/* Sección con los datos de pago */}
                    <div className="bg-gray-50 p-4 rounded-md shadow-md mb-6">
                        <h1 className="text-xl font-bold text-center text-gray-800">
                            Datos para el pago
                        </h1>
                        <p className="text-center text-gray-700 mt-2">
                            Cédula: 123456789
                        </p>
                        <p className="text-center text-gray-700">
                            Teléfono: +1 234 567 890
                        </p>
                        <p className="text-center text-gray-700">
                            Monto a pagar: ${plan?.price ? plan.price : "No especificado"}
                        </p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700">
                                Comprobante de pago (imagen)
                            </label>
                            <div className="mt-1">
                                <input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleFileChange}
                                    className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
                                />
                            </div>
                            {error && <p className="text-red-500 mt-2">{error}</p>}
                        </div>
                        <div>
                            <button
                                type="submit"
                                className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                                disabled={loading}
                            >
                                {loading ? "Enviando..." : "Enviar Comprobante"}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default PaymentForm;
