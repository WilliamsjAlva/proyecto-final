// src/components/Post.jsx
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import Comment from "./Comment";
import Chat from "./Chat";

const Post = ({ post }) => {
    const { auth } = useContext(AuthContext);
    const [likes, setLikes] = useState(post.likes || 0);
    const [dislikes, setDislikes] = useState(post.dislikes || 0);
    const [userReaction, setUserReaction] = useState(null); // "like", "dislike", o null
    const [comments, setComments] = useState([]);
    const [showChat, setShowChat] = useState(false);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    // Cargar comentarios
    const loadComments = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/comments/${post._id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setComments(response.data.comments);
        } catch (err) {
            console.error("Error al cargar comentarios:", err);
        }
    };

    useEffect(() => {
        loadComments();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // Redirige al detalle del post
    const handleContainerClick = () => {
        navigate(`/post/${post._id}`);
    };

    // Función para dar like
    const handleLike = async (e) => {
        e.stopPropagation();
        try {
            if (userReaction === "like") return;
            const response = await axios.post(`http://localhost:5000/api/posts/${post._id}/like`, {}, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            const updatedPost = response.data.post;
            setLikes(updatedPost.likes);
            setDislikes(updatedPost.dislikes);
            setUserReaction("like");
        } catch (err) {
            setError("Error al dar like. Inténtalo de nuevo más tarde.");
        }
    };

    // Función para dar dislike
    const handleDislike = async (e) => {
        e.stopPropagation();
        try {
            if (userReaction === "dislike") return;
            const response = await axios.post(`http://localhost:5000/api/posts/${post._id}/dislike`, {}, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            const updatedPost = response.data.post;
            setLikes(updatedPost.likes);
            setDislikes(updatedPost.dislikes);
            setUserReaction("dislike");
        } catch (err) {
            setError("Error al dar dislike. Inténtalo de nuevo más tarde.");
        }
    };

    // Función para reportar la publicación
    const handleReport = async (e) => {
        e.stopPropagation();
        try {
            await axios.post(`http://localhost:5000/api/posts/${post._id}/report`, {}, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            alert("Publicación reportada. Los moderadores serán notificados.");
        } catch (err) {
            setError("Error al reportar. Inténtalo de nuevo más tarde.");
        }
    };

    // Lógica para mostrar el botón de Chat Privado
    const showChatButton = () => {
        if (!auth || !auth.user) return false;
        return (
            (auth.user.isPremium && post.allowPrivateChat) ||
            auth.user.role === "technician"
        );
    };

    return (
        <div
            className="p-4 border rounded shadow mb-4 cursor-pointer"
            onClick={handleContainerClick}
        >
            {error && <p className="text-red-500">{error}</p>}
            <h2 className="text-xl font-bold">{post.title}</h2>
            {/* Mostrar el nombre de usuario del autor */}
            {post.author && (
                <p className="text-sm text-gray-500">Por: {post.author.username}</p>
            )}
            <p>{post.description}</p>
            <div className="flex items-center space-x-4 mt-2">
                <button onClick={(e) => handleLike(e)} className="text-blue-600">
                    Like ({likes})
                </button>
                <button onClick={(e) => handleDislike(e)} className="text-red-600">
                    Dislike ({dislikes})
                </button>
                <button onClick={(e) => handleReport(e)} className="text-gray-600">
                    Reportar
                </button>
                {showChatButton() && (
                    <button
                        onClick={(e) => { e.stopPropagation(); setShowChat(!showChat); }}
                        className="text-green-600"
                    >
                        {showChat ? "Cerrar Chat" : "Chat Privado"}
                    </button>
                )}
            </div>
            <div className="mt-4">
                {comments.map((comment) => (
                    <Comment
                        key={comment._id || comment.id}
                        comment={comment}
                        postId={post._id}
                        refreshComments={loadComments}
                    />
                ))}
            </div>
            {showChat && <Chat post={post} />}
        </div>
    );
};

export default Post;
