/* eslint-disable */
import React, { useState, useEffect, useContext, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import likeImg from "../assets/like.png";
import likedImg from "../assets/liked.png";
import dislikeImg from "../assets/dislike.png";
import dislikedImg from "../assets/disliked.png";
import Comment from "../components/Comment";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";
import ImageModal from "../components/ImageModal";
import "../styles/text.css";

const PostDetail = () => {
    const { id } = useParams();
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();

    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState("");
    const [reportMessage, setReportMessage] = useState("");
    const [editing, setEditing] = useState(false);
    const [editedTitle, setEditedTitle] = useState("");
    const [editedDescription, setEditedDescription] = useState("");
    const [newComment, setNewComment] = useState("");
    const [showDeleteOptions, setShowDeleteOptions] = useState(false);
    const [userReaction, setUserReaction] = useState(null);

    // Estados para el formulario de nuevo comentario con imagen
    const [commentImage, setCommentImage] = useState(null);
    const [commentPreviewUrl, setCommentPreviewUrl] = useState(null);
    const commentFileInputRef = useRef(null);

    // Estado para el modal de imagen de la publicación
    const [modalImage, setModalImage] = useState(null);

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

    const loadComments = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/comments/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setComments(response.data.comments);
        } catch (err) {
            console.error("Error al cargar comentarios:", err);
        }
    };

    useEffect(() => {
        loadPost();
        loadComments();
    }, [id, auth.token]);

    useEffect(() => {
        if (auth && auth.user && post) {
            const userId = auth.user._id.toString();
            if (post.likedBy && post.likedBy.some(id => id.toString() === userId)) {
                setUserReaction("like");
            } else if (post.dislikedBy && post.dislikedBy.some(id => id.toString() === userId)) {
                setUserReaction("dislike");
            } else {
                setUserReaction(null);
            }
        }
    }, [auth, post]);

    // Actualizar solo los campos de reacciones, sin perder la información del post (incluyendo el autor)
    const updateReactionState = (updatedPost) => {
        setPost(prevPost => ({
            ...prevPost,
            likes: updatedPost.likes,
            dislikes: updatedPost.dislikes,
            likedBy: updatedPost.likedBy,
            dislikedBy: updatedPost.dislikedBy,
        }));
        if (auth && auth.user) {
            const userId = auth.user._id.toString();
            if (updatedPost.likedBy && updatedPost.likedBy.some(id => id.toString() === userId)) {
                setUserReaction("like");
            } else if (updatedPost.dislikedBy && updatedPost.dislikedBy.some(id => id.toString() === userId)) {
                setUserReaction("dislike");
            } else {
                setUserReaction(null);
            }
        }
    };

    const canEdit = () => {
        if (!post || !auth || !auth.user) return false;
        const authorId = post.author?._id || post.author;
        if (!authorId || !auth.user._id) return false;
        const creationTime = new Date(post.createdAt);
        const oneHourLater = new Date(creationTime.getTime() + 60 * 60 * 1000);
        return auth.user._id.toString() === authorId.toString() && new Date() < oneHourLater;
    };

    const canDelete = () => {
        if (!post || !auth || !auth.user) return false;
        const authorId = post.author?._id || post.author;
        if (!authorId || !auth.user._id) return false;
        return (
            auth.user.role === "admin" ||
            auth.user.role === "moderator" ||
            auth.user._id.toString() === authorId.toString()
        );
    };

    const handleEditSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.put(
                `http://localhost:5000/api/posts/${id}`,
                { title: editedTitle, description: editedDescription },
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            updateReactionState(response.data.post);
            setEditing(false);
        } catch (err) {
            console.error("Error al editar la publicación:", err);
            setError("Error al editar la publicación. Inténtalo de nuevo más tarde.");
        }
    };

    const handleDelete = () => {
        setShowDeleteOptions(true);
    };

    const confirmDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            navigate("/feed");
        } catch (err) {
            console.error("Error al borrar la publicación:", err);
            setError("Error al borrar la publicación. Inténtalo de nuevo más tarde.");
        }
    };

    const cancelDelete = () => {
        setShowDeleteOptions(false);
    };

    const handleLike = async () => {
        try {
            let response;
            if (userReaction === "like") {
                response = await axios.post(
                    `http://localhost:5000/api/posts/${id}/unlike`,
                    {},
                    { headers: { Authorization: `Bearer ${auth.token}` } }
                );
            } else {
                response = await axios.post(
                    `http://localhost:5000/api/posts/${id}/like`,
                    {},
                    { headers: { Authorization: `Bearer ${auth.token}` } }
                );
            }
            updateReactionState(response.data.post);
        } catch (err) {
            setError("Error al dar like. Inténtalo de nuevo más tarde.");
        }
    };

    const handleDislike = async () => {
        try {
            let response;
            if (userReaction === "dislike") {
                response = await axios.post(
                    `http://localhost:5000/api/posts/${id}/undislike`,
                    {},
                    { headers: { Authorization: `Bearer ${auth.token}` } }
                );
            } else {
                response = await axios.post(
                    `http://localhost:5000/api/posts/${id}/dislike`,
                    {},
                    { headers: { Authorization: `Bearer ${auth.token}` } }
                );
            }
            updateReactionState(response.data.post);
        } catch (err) {
            setError("Error al dar dislike. Inténtalo de nuevo más tarde.");
        }
    };

    const handleReport = async () => {
        try {
            await axios.post(
                `http://localhost:5000/api/posts/${id}/report`,
                {},
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            setReportMessage("Publicación reportada exitosamente");
            setTimeout(() => setReportMessage(""), 3000);
        } catch (err) {
            setError("Error al reportar. Inténtalo de nuevo más tarde.");
        }
    };

    const handleCommentImageChange = (e) => {
        const file = e.target.files[0];
        setCommentImage(file);
        setCommentPreviewUrl(file ? URL.createObjectURL(file) : null);
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim() && !commentImage) return;
        try {
            const data = new FormData();
            data.append("text", newComment);
            data.append("postId", id);
            if (commentImage) data.append("image", commentImage);
            await axios.post("http://localhost:5000/api/comments", data, {
                headers: {
                    Authorization: `Bearer ${auth.token}`,
                    "Content-Type": "multipart/form-data",
                },
            });
            setNewComment("");
            setCommentImage(null);
            setCommentPreviewUrl(null);
            loadComments();
        } catch (err) {
            console.error("Error al añadir comentario:", err);
            setError("Error al añadir comentario. Inténtalo de nuevo más tarde.");
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
        <div className="container mx-auto p-4 pl-20 pr-20">
            <button onClick={handleBack} className="mb-4 px-4 py-2 bg-gray-300 transition hover:bg-gray-400 cursor-pointer rounded-4xl">
                Atrás
            </button>
            {error && <p className="pWeb text-red-500 mb-4">{error}</p>}
            {reportMessage && <p className="text-red-600 mb-4">{reportMessage}</p>}
            <div className="p-4 border-[1px] border-[#CCCCCC] bg-[#FCFCFC] rounded mb-6">
                <div className="flex justify-between items-center mb-4">
                    {post.author && !post.anonymous && (
                        <p className="text-lg font-semibold text-gray-700">
                            @{post.author.username}
                        </p>
                    )}
                    {/* Mostrar la fecha de publicación */}
                    <p className="text-xs text-gray-500">
                        Publicado el {new Date(post.createdAt).toLocaleString()}
                    </p>
                </div>
                {editing ? (
                    <form onSubmit={handleEditSubmit} className="w-full">
                        <input
                            type="text"
                            value={editedTitle}
                            onChange={(e) => setEditedTitle(e.target.value)}
                            className="h1Web font-bold mb-2 border p-2 w-full"
                            required
                        />
                        <textarea
                            value={editedDescription}
                            onChange={(e) => setEditedDescription(e.target.value)}
                            className="mb-2 border p-2 w-full"
                            required
                        ></textarea>
                        <div>
                            <PrimaryButton
                                type="submit"
                                text="Guardar cambios"
                                className="pWeb px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded"
                            />
                            <SecondaryButton
                                type="button"
                                text="Cancelar"
                                onClick={() => setEditing(false)}
                                className="pWeb ml-2 px-4 py-2 border-gray-500 hover:border-gray-600 text-gray-500 hover:text-gray-600 rounded"
                            />
                        </div>
                    </form>
                ) : (
                    <div className="w-full flex flex-col">
                        <h1 className="h1Web font-bold mb-2">
                            {post.title}{" "}
                            {post.isEdited && <span className="pWeb text-gray-500">(editado)</span>}
                        </h1>
                    </div>
                )}
                {showDeleteOptions && (
                    <div className="mb-4">
                        <p className="pWeb text-red-600">¿Confirmas borrar esta publicación?</p>
                        <PrimaryButton
                            onClick={confirmDelete}
                            text="Confirmar"
                            className="pWeb mr-2 px-4 py-2 bg-red-500 hover:bg-red-700 text-white"
                        />
                        <SecondaryButton
                            onClick={cancelDelete}
                            text="Cancelar"
                            className="pWeb px-4 py-2 border-gray-500 hover:border-gray-600 text-gray-500 hover:text-gray-600 rounded"
                        />
                    </div>
                )}
                <div className="flex items-center space-x-4 mb-4">
                    <button onClick={handleLike} className="pWeb text-red-600">
                        <img
                            src={userReaction === "like" ? likedImg : likeImg}
                            alt="Like"
                            className="inline-block w-7 h-7 mr-2"
                        />
                        {post.likes}
                    </button>
                    <button onClick={handleDislike} className="pWeb text-blue-600">
                        <img
                            src={userReaction === "dislike" ? dislikedImg : dislikeImg}
                            alt="Dislike"
                            className="inline-block w-7 h-7 mr-2"
                        />
                        {post.dislikes}
                    </button>
                    {canDelete() && (
                        <button onClick={handleDelete} className="text-red-500 underline text-sm">
                            Borrar
                        </button>
                    )}
                    {canEdit() && (
                        <button onClick={() => setEditing(true)} className="text-gray-500 underline text-sm ml-4">
                            Editar
                        </button>
                    )}
                </div>
                <p className="mb-4">{post.description}</p>
                {/* Mostrar la imagen de la publicación si existe */}
                {post.image && (
                    <div className="mb-4">
                        <img
                            src={`http://localhost:5000/${post.image}`}
                            alt="Imagen de la publicación"
                            style={{ maxWidth: "100%", borderRadius: "4px", cursor: "pointer" }}
                            onClick={() => setModalImage(`http://localhost:5000/${post.image}`)}
                        />
                    </div>
                )}
            </div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Comentarios</h2>
                {comments.length === 0 ? (
                    <p>No hay comentarios.</p>
                ) : (
                    <div className="space-y-4">
                        {comments.map((comment) => (
                            <Comment
                                key={comment._id}
                                comment={comment}
                                postId={id}
                                refreshComments={loadComments}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className="mb-6">
                <h2 className="text-2xl font-bold mb-4">Añadir Comentario</h2>
                <form onSubmit={handleCommentSubmit}>
                    <textarea
                        value={newComment}
                        onChange={(e) => setNewComment(e.target.value)}
                        className="w-full p-2 border rounded mb-2"
                        placeholder="Escribe tu comentario..."
                        required={!commentImage}
                    ></textarea>
                    <div className="flex items-center justify-between">
                        <PrimaryButton type="submit" text="Publicar comentario" />
                        <div
                            className="cursor-pointer flex items-center justify-center w-48 h-12 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                            onClick={() => commentFileInputRef.current.click()}
                        >
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleCommentImageChange}
                                ref={commentFileInputRef}
                                style={{ display: "none" }}
                            />
                            {commentPreviewUrl ? (
                                <img
                                    src={commentPreviewUrl}
                                    alt="Vista previa"
                                    className="w-full h-full object-cover rounded-lg"
                                />
                            ) : (
                                <div className="flex items-center gap-2 text-gray-600">
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        fill="none"
                                        viewBox="0 0 24 24"
                                        strokeWidth="1.5"
                                        stroke="currentColor"
                                        className="w-6 h-6"
                                    >
                                        <path
                                            strokeLinecap="round"
                                            strokeLinejoin="round"
                                            d="M6.75 7.5l-.662-1.323A2.25 2.25 0 0 0 4.125 5h-1.5A2.25 2.25 0 0 0 .375 7.5v9a2.25 2.25 0 0 0 2.25 2.25h19.5a2.25 2.25 0 0 0 2.25-2.25v-9A2.25 2.25 0 0 0 22.125 5h-1.5a2.25 2.25 0 0 0-1.963 1.177L18 7.5M3.75 9.75h16.5M7.5 14.25h9M10.5 11.25h3"
                                        />
                                    </svg>
                                    <span>Subir Imagen</span>
                                </div>
                            )}
                        </div>
                    </div>
                </form>
            </div>
            {modalImage && (
                <ImageModal src={modalImage} onClose={() => setModalImage(null)} />
            )}
        </div>
    );
};

export default PostDetail;
