// src/pages/PostDetail.jsx
import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const PostDetail = () => {
    const { id } = useParams(); // id es el ObjectId de la publicación
    const { auth } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [error, setError] = useState("");
    const [editing, setEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const navigate = useNavigate();

    // Cargar la publicación
    const loadPost = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setPost(response.data.post);
            setEditedTitle(response.data.post.title);
            setEditedDescription(response.data.post.description);
        } catch (err) {
            console.error("Error al cargar la publicación:", err);
            setError("Error al cargar la publicación. Inténtalo de nuevo más tarde.");
        }
    };

    useEffect(() => {
        loadPost();
    }, [id, auth.token]);

    // Función para determinar si el usuario puede editar la publicación:
    // El usuario debe ser el autor y no haber pasado 1 hora desde la creación.
    const canEdit = () => {
        if (!post || !auth || !auth.user) return false;
        let authorId = null;
        if (post.author) {
            if (typeof post.author === "object" && post.author._id) {
                authorId = post.author._id;
            } else if (typeof post.author === "string") {
                authorId = post.author;
            }
        }
        if (!authorId || !auth.user._id) return false;
        if (auth.user._id.toString() !== authorId.toString()) return false;
        const creationTime = new Date(post.createdAt);
        const oneHourLater = new Date(creationTime.getTime() + 60 * 60 * 1000);
        return new Date() < oneHourLater;
    };

    // Función para determinar si el usuario puede borrar la publicación:
    // Admin y moderadores pueden borrar cualquier publicación; de lo contrario, solo el autor.
    const canDelete = () => {
        if (!post || !auth || !auth.user) return false;
        let authorId = null;
        if (post.author) {
            if (typeof post.author === "object" && post.author._id) {
                authorId = post.author._id;
            } else if (typeof post.author === "string") {
                authorId = post.author;
            }
        }
        if (!authorId || !auth.user._id) return false;
        return (
            auth.user.role === "admin" ||
            auth.user.role === "moderator" ||
            auth.user._id.toString() === authorId.toString()
        );
    };

    // Manejadores para like, dislike y reportar
    const handleLike = async () => {
        try {
            await axios.post(`http://localhost:5000/api/posts/${id}/like`, {}, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            loadPost();
        } catch (err) {
            setError("Error al dar like. Inténtalo de nuevo más tarde.");
        }
    };

    const handleDislike = async () => {
        try {
            await axios.post(`http://localhost:5000/api/posts/${id}/dislike`, {}, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            loadPost();
        } catch (err) {
            setError("Error al dar dislike. Inténtalo de nuevo más tarde.");
        }
    };

    const handleReport = async () => {
        try {
            await axios.post(`http://localhost:5000/api/posts/${id}/report`, {}, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            alert("Publicación reportada. Los moderadores serán notificados.");
        } catch (err) {
            setError("Error al reportar. Inténtalo de nuevo más tarde.");
        }
    };

    // Manejador para editar la publicación
    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:5000/api/posts/${id}`,
                { title: editedTitle, description: editedDescription },
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            setPost(response.data.post);
            setEditing(false);
        } catch (err) {
            console.error("Error al editar la publicación:", err);
            setError("Error al editar la publicación. Inténtalo de nuevo más tarde.");
        }
    };

    // Manejador para borrar la publicación
    const handleDelete = async () => {
        if (window.confirm("¿Estás seguro de que deseas borrar esta publicación?")) {
            try {
                await axios.delete(`http://localhost:5000/api/posts/${id}`, {
                    headers: { Authorization: `Bearer ${auth.token}` },
                });
                navigate("/feed");
            } catch (err) {
                console.error("Error al borrar la publicación:", err);
                setError("Error al borrar la publicación. Inténtalo de nuevo más tarde.");
            }
        }
    };

    const handleBack = () => {
        navigate(-1);
    };

    if (!post)
        return (
            <div className="container mx-auto p-4">
                {error || "Cargando publicación..."}
            </div>
        );

    return (
        <div className="container mx-auto p-4">
            <button onClick={handleBack} className="mb-4 px-4 py-2 bg-gray-300 rounded">
                Atrás
            </button>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="p-4 border rounded shadow mb-6">
                {editing ? (
                    <form onSubmit={handleEditSubmit} className="w-full">
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="text-4xl font-bold mb-2 border p-2 w-full"
                            required
                        />
                        <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="mb-2 border p-2 w-full"
                            required
                        ></textarea>
                        <div>
                            <button type="submit" className="px-4 py-2 bg-blue-500 text-white rounded">
                                Guardar cambios
                            </button>
                            <button
                                type="button"
                                onClick={() => setEditing(false)}
                                className="ml-2 px-4 py-2 bg-gray-500 text-white rounded"
                            >
                                Cancelar
                            </button>
                        </div>
                    </form>
                ) : (
                    <div className="w-full flex flex-col">
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-bold mb-2">
                                {post.title}{" "}
                                {post.isEdited && (
                                    <span className="text-xs text-gray-500">(editado)</span>
                                )}
                            </h1>
                            {canDelete() && (
                                <button
                                    onClick={handleDelete}
                                    className="text-red-500 underline text-sm"
                                >
                                    Borrar
                                </button>
                            )}
                        </div>
                        <div className="flex items-center space-x-4 mb-4">
                            <button onClick={handleLike} className="text-blue-600">
                                Like ({post.likes})
                            </button>
                            <button onClick={handleDislike} className="text-red-600">
                                Dislike ({post.dislikes})
                            </button>
                            <button onClick={handleReport} className="text-gray-600">
                                Reportar
                            </button>
                            {canEdit() && (
                                <button
                                    onClick={() => setEditing(true)}
                                    className="text-gray-500 underline text-sm ml-4"
                                >
                                    Editar
                                </button>
                            )}
                        </div>
                        <p className="mb-4">{post.description}</p>
                    </div>
                )}
            </div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Comentarios</h2>
                {/* Aquí se agregarían los comentarios */}
            </div>
        </div>
    );
};

export default PostDetail;
