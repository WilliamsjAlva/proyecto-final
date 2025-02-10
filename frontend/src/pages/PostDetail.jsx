import React, { useState, useEffect, useContext } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import Comment from "../components/Comment";
import Chat from "../components/Chat";

const PostDetail = () => {
    const { id } = useParams();
    const { auth } = useContext(AuthContext);
    const [post, setPost] = useState(null);
    const [comments, setComments] = useState([]);
    const [error, setError] = useState("");
    const navigate = useNavigate();

    const loadPost = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/posts/${id}`, {
                headers: { Authorization: `Bearer ${auth.token}` },
            });
            setPost(response.data.post);
        } catch (err) {
            console.error("Error al cargar el post:", err);
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
    }, [id]);

    const handleBack = () => {
        navigate(-1);
    };

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

    if (!post) return <div>Cargando publicación...</div>;

    return (
        <div className="container mx-auto p-4">
            <button onClick={handleBack} className="mb-4 px-4 py-2 bg-gray-300 rounded">
                Atrás
            </button>
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="p-4 border rounded shadow mb-6">
                <h1 className="text-4xl font-bold mb-4">{post.title}</h1>
                <p className="mb-4">{post.description}</p>
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
                    {post.allowPrivateChat && auth.user && (
                        <button onClick={() => setShowChat(prev => !prev)} className="text-green-600">
                            {showChat ? "Cerrar Chat" : "Chat Privado"}
                        </button>
                    )}
                </div>
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
            {post.allowPrivateChat && <Chat post={post} />}
        </div>
    );
};

export default PostDetail;
