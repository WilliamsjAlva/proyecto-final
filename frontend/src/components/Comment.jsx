import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";

const Comment = ({ comment, postId, refreshComments }) => {
    const { auth } = useContext(AuthContext);
    const [replyText, setReplyText] = useState("");
    const [error, setError] = useState("");

    const handleReplySubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(
                "http://localhost:5000/api/comments",
                {
                    text: replyText,
                    postId: postId,
                    parentComment: comment._id || comment.id,
                },
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            setReplyText("");
            refreshComments();
        } catch (err) {
            setError("Error al enviar respuesta. Inténtalo de nuevo más tarde.");
        }
    };

    const handleReport = async () => {
        try {
            await axios.post(
                `http://localhost:5000/api/comments/${comment._id || comment.id}/report`,
                {},
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            alert("Comentario reportado. Los moderadores serán notificados.");
        } catch (err) {
            setError("Error al reportar comentario. Inténtalo de nuevo más tarde.");
        }
    };

    return (
        <div className="border p-2 rounded mb-2">
            {error && <p className="text-red-500">{error}</p>}
            <p className="font-semibold">
                {comment.author.name} ({comment.author.username})
            </p>
            <p>{comment.text}</p>
            <div className="flex space-x-4 mt-1">
                <button className="text-blue-600">
                    Like ({comment.likes || 0})
                </button>
                <button className="text-red-600">
                    Dislike ({comment.dislikes || 0})
                </button>
                <button onClick={handleReport} className="text-gray-600">
                    Reportar
                </button>
            </div>
            <form onSubmit={handleReplySubmit} className="mt-2">
                <input
                    type="text"
                    placeholder="Responder..."
                    value={replyText}
                    onChange={(e) => setReplyText(e.target.value)}
                    className="w-full p-2 border rounded"
                    required
                />
            </form>
        </div>
    );
};

export default Comment;
