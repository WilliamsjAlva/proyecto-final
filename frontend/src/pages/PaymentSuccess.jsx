// src/pages/PaymentSuccess.jsx
import React from "react";
import { Link } from "react-router-dom";

const PaymentSuccess = () => {
    return (
        <div className="p-4 text-center">
            <h2 className="text-2xl font-bold mb-4">¡Solicitud Enviada!</h2>
            <p>
                Tu comprobante ha sido enviado para verificación. Recibirás una notificación
                cuando se actualice tu estado premium.
            </p>
            <Link to="/" className="mt-4 inline-block text-blue-500">
                Volver al inicio
            </Link>
        </div>
    );
};

export default PaymentSuccess;
