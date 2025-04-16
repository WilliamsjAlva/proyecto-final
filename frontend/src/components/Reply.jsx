// src/components/Reply.jsx
import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const Reply = ({ reply, refreshComments }) => {
    const { auth } = useContext(AuthContext);
    const [editing, setEditing] = useState(false);
    const [editedText, setEditedText] = useState(reply.text);
    const [error, setError] = useState("");

    // Manejador para editar el comentario
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.put(
                `http://localhost:5000/api/comments/${reply._id}`,
                { text: editedText },
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            setEditing(false);
            refreshComments();
        } catch (err) {
            console.error("Error al editar el comentario:", err);
            setError("Error al editar el comentario. Inténtalo de nuevo más tarde.");
        }
    };

    // Manejador para borrar el comentario
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/comments/${reply._id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            refreshComments();
        } catch (err) {
            console.error("Error al borrar el comentario:", err);
            setError("Error al borrar el comentario. Inténtalo de nuevo más tarde.");
        }
    };

    return (
        <div className="p-2 border-l-2 ml-4 mb-2">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {editing ? (
                <form onSubmit={handleEditSubmit}>
                    <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="w-full border p-1 rounded"
                    ></textarea>
                    <div className="mt-1">
                        <button type="submit" className="text-blue-600 underline text-sm">
                            Guardar
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditing(false)}
                            className="text-gray-600 underline text-sm ml-2"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            ) : (
                <div>
                    <p className="text-sm text-gray-600">
                        {reply.author && reply.author.username}
                    </p>
                    <p>{reply.text}</p>
                    <div className="flex items-center space-x-2 mt-1">
                        <button className="text-blue-600 text-sm">Like</button>
                        <button className="text-red-600 text-sm">Dislike</button>
                        <button className="text-gray-600 text-sm">Reportar</button>
                        <button
                            onClick={handleDelete}
                            className="text-red-500 underline text-sm ml-2"
                        >
                            Borrar
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Reply;
