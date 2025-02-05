// src/pages/OnlyTechnicians.jsx
import React from "react";

const OnlyTechnicians = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Página de Técnicos</h1>
            <p>Esta página es accesible solo para usuarios con rol <strong>technician</strong>.</p>
        </div>
    );
};

export default OnlyTechnicians;
