// src/pages/OnlyMods.jsx
import React from "react";

const OnlyMods = () => {
    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-4">Página de Moderadores</h1>
            <p>Esta página es accesible solo para usuarios con rol <strong>moderator</strong>.</p>
        </div>
    );
};

export default OnlyMods;
