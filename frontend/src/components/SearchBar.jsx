// src/components/SearchBar.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const SearchBar = () => {
    const [term, setTerm] = useState("");
    const navigate = useNavigate();

    const handleSearch = () => {
        if (term.trim()) {
            // Redirige a la ruta /search/:query
            navigate(`/search/${encodeURIComponent(term.trim())}`);
        }
    };

    return (
        <div className="flex items-center space-x-2">
            <input
                type="text"
                placeholder="Buscar publicaciones..."
                value={term}
                onChange={(e) => setTerm(e.target.value)}
                className="p-2 border rounded"
            />
            <button onClick={handleSearch} className="px-4 py-2 bg-blue-500 text-white rounded">
                Buscar
            </button>
        </div>
    );
};

export default SearchBar;
