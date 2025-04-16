/* eslint-disable */
import React, { useState, useContext, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import likeImg from "../assets/like.png";
import likedImg from "../assets/liked.png";
import dislikeImg from "../assets/dislike.png";
import dislikedImg from "../assets/disliked.png";
import ImageModal from "./ImageModal"; // Asegúrate de que la ruta sea correcta
import PrimaryButton from "./PrimaryButton";

const Comment = ({ comment, postId, refreshComments }) => {
    const { auth } = useContext(AuthContext);
    const [editing, setEditing] = useState(false);
    const [editedText, setEditedText] = useState(comment.text);
    const [error, setError] = useState("");
    const [reportMessage, setReportMessage] = useState("");
    const [showDeleteOptions, setShowDeleteOptions] = useState(false);
    const [userReaction, setUserReaction] = useState(null); // "like", "dislike" o null
    const [likes, setLikes] = useState(comment.likes || 0);
    const [dislikes, setDislikes] = useState(comment.dislikes || 0);
    const [modalImage, setModalImage] = useState(null);

    // Establecer la reacción inicial del usuario basándonos en la base de datos
    useEffect(() => {
        if (auth && auth.user && comment) {
            const userId = auth.user._id.toString();
            if (comment.likedBy && comment.likedBy.some(id => id.toString() === userId)) {
                setUserReaction("like");
            } else if (comment.dislikedBy && comment.dislikedBy.some(id => id.toString() === userId)) {
                setUserReaction("dislike");
            } else {
                setUserReaction(null);
            }
        }
    }, [auth, comment]);

    const canEdit = () => {
        if (!auth || !auth.user || !comment.author) return false;
        const authorId = typeof comment.author === "object" ? comment.author._id : comment.author;
        return authorId && auth.user._id.toString() === authorId.toString();
    };

    const canDelete = () => {
        if (!auth || !auth.user || !comment.author) return false;
        const authorId = typeof comment.author === "object" ? comment.author._id : comment.author;
        return (
            (authorId && auth.user._id.toString() === authorId.toString()) ||
            auth.user.role === "admin" ||
            auth.user.role === "moderator"
        );
    };

    const updateReactionState = (updatedComment) => {
        setLikes(updatedComment.likes);
        setDislikes(updatedComment.dislikes);
        const userId = auth.user._id.toString();
        if (updatedComment.likedBy && updatedComment.likedBy.some(id => id.toString() === userId)) {
            setUserReaction("like");
        } else if (updatedComment.dislikedBy && updatedComment.dislikedBy.some(id => id.toString() === userId)) {
            setUserReaction("dislike");
        } else {
            setUserReaction(null);
        }
    };

    const handleLike = async () => {
        try {
            let response;
            if (userReaction === "like") {
                response = await axios.post(
                    `http://localhost:5000/api/comments/${comment._id}/unlike`,
                    {},
                    { headers: { Authorization: `Bearer ${auth.token}` } }
                );
            } else {
                response = await axios.post(
                    `http://localhost:5000/api/comments/${comment._id}/like`,
                    {},
                    { headers: { Authorization: `Bearer ${auth.token}` } }
                );
            }
            updateReactionState(response.data.comment);
            refreshComments();
        } catch (err) {
            // console.error("Error al dar like al comentario:", err);
            // setError("Error al dar like. Inténtalo de nuevo más tarde.");
        }
    };

    const handleDislike = async () => {
        try {
            let response;
            if (userReaction === "dislike") {
                response = await axios.post(
                    `http://localhost:5000/api/comments/${comment._id}/undislike`,
                    {},
                    { headers: { Authorization: `Bearer ${auth.token}` } }
                );
            } else {
                response = await axios.post(
                    `http://localhost:5000/api/comments/${comment._id}/dislike`,
                    {},
                    { headers: { Authorization: `Bearer ${auth.token}` } }
                );
            }
            updateReactionState(response.data.comment);
            refreshComments();
        } catch (err) {
            //console.error("Error al dar dislike al comentario:", err);
            //setError("Error al dar dislike. Inténtalo de nuevo más tarde.");
        }
    };

    const handleReport = async () => {
        try {
            await axios.post(
                `http://localhost:5000/api/comments/${comment._id}/report`,
                {},
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            setReportMessage("Comentario reportado exitosamente");
            setTimeout(() => setReportMessage(""), 3000);
        } catch (err) {
            //console.error("Error al reportar el comentario:", err);
            //setError("Error al reportar. Inténtalo de nuevo más tarde.");
        }
    };

    const handleDelete = () => {
        setShowDeleteOptions(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/comments/${comment._id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            refreshComments();
        } catch (err) {
            console.error("Error al borrar el comentario:", err);
            setError("Error al borrar el comentario. Inténtalo de nuevo más tarde.");
        }
    };

    const cancelDelete = () => {
        setShowDeleteOptions(false);
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:5000/api/comments/${comment._id}`,
                { text: editedText },
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            refreshComments();
            setEditing(false);
        } catch (err) {
            console.error("Error al actualizar el comentario:", err);
            setError("Error al actualizar el comentario. Inténtalo de nuevo.");
        }
    };

    return (
        <div className="p-2 border-[1px] border-[#7c7c7c] bg-[#FCFCFC] rounded mb-2">
            {error && <p className="text-red-500 text-sm">{error}</p>}
            {reportMessage && <p className="text-red-600 text-sm">{reportMessage}</p>}
            {editing ? (
                <form onSubmit={handleEditSubmit}>
                    <textarea
                        value={editedText}
                        onChange={(e) => setEditedText(e.target.value)}
                        className="w-full border p-1 rounded"
                    ></textarea>
                    {comment.image && (
                        <div className="mt-2">
                            <p className="pWeb text-sm text-gray-500">Imagen actual:</p>
                            <img
                                src={`http://localhost:5000/${comment.image}`}
                                alt="Imagen del comentario"
                                className="w-96 rounded cursor-pointer"
                                onClick={() => setModalImage(`http://localhost:5000/${comment.image}`)}
                            />
                        </div>
                    )}
                    <div className="mt-1">
                        <button type="submit" className="text-blue-600  text-sm">
                            Guardar
                        </button>
                        <button
                            type="button"
                            onClick={() => setEditing(false)}
                            className="text-gray-600  text-sm ml-2"
                        >
                            Cancelar
                        </button>
                    </div>
                </form>
            ) : (
                <div>
                    <p className="pWeb text-sm text-gray-600">
                        {comment.author && comment.author.username}
                    </p>
                    <p className="pWeb p-1">{comment.text}</p>
                    {comment.image && (
                        <div className="mt-2">
                            <img
                                src={`http://localhost:5000/${comment.image}`}
                                alt="Imagen del comentario"
                                className="w-96 rounded cursor-pointer"
                                onClick={() => setModalImage(`http://localhost:5000/${comment.image}`)}
                            />
                        </div>
                    )}
                    <div className="flex items-center space-x-2 mt-1">
                        <button onClick={handleLike} className="text-red-600 text-sm">
                            <img
                                src={userReaction === "like" ? likedImg : likeImg}
                                alt="Like"
                                className="inline-block w-6 h-6 mr-1"
                            />
                            {likes}
                        </button>
                        <button onClick={handleDislike} className="text-blue-600 text-sm">
                            <img
                                src={userReaction === "dislike" ? dislikedImg : dislikeImg}
                                alt="Dislike"
                                className="inline-block w-6 h-6 mr-1"
                            />
                            {dislikes}
                        </button>
                        {canEdit() && (
                            <button
                                onClick={() => setEditing(true)}
                                className="text-gray-500 cursor-pointer  text-sm ml-2"
                            >
                                Editar
                            </button>
                        )}
                        {canDelete() && (
                            <button
                                onClick={handleDelete}
                                className="text-red-500 cursor-pointer  text-sm ml-2"
                            >
                                Borrar
                            </button>
                        )}
                    </div>
                    {showDeleteOptions && (
                        <div className="mt-2">
                            <p className="pWeb text-red-600 text-sm">
                                ¿Confirmas borrar este comentario?
                            </p>
                            <PrimaryButton
                                text="Confirmar"
                                className="pWeb mr-2 px-3 py-1 bg-red-500 hover:bg-red-600 text-white rounded text-sm"
                                onClick={confirmDelete}
                            />
                            <PrimaryButton
                                text="Cancelar"
                                className="pWeb px-3 py-1 bg-gray-500 hover:bg-gray-600 text-white rounded text-sm"
                                onClick={cancelDelete}
                            />
                        </div>
                    )}
                </div>
            )}
            {modalImage && (
                <ImageModal src={modalImage} onClose={() => setModalImage(null)} />
            )}
        </div>
    );
};

export default Comment;
