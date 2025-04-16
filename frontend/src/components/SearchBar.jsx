/* eslint-disable */
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import '../styles/text.css';
import PrimaryButton from "../components/PrimaryButton";

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
                className="p-2 border-[#CCCCCC] bg-[#FCFCFC] border transition duration-300 rounded focus:rounded-full"
            />
            <PrimaryButton text="Buscar" onClick={handleSearch} className="pWeb px-4 py-2"/>
        </div>
    );
};

export default SearchBar;
