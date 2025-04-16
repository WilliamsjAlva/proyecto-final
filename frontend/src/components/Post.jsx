/*eslint-disable */
import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import "../styles/text.css";
import likeImg from "../assets/like.png";
import likedImg from "../assets/liked.png";
import dislikeImg from "../assets/dislike.png";
import dislikedImg from "../assets/disliked.png";

const Post = ({ post }) => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [likes, setLikes] = useState(post.likes || 0);
    const [dislikes, setDislikes] = useState(post.dislikes || 0);
    const [commentsCount, setCommentsCount] = useState(post.commentsCount || 0);
    const [userReaction, setUserReaction] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        if (auth && auth.user && post) {
            const userId = auth.user._id.toString();
            if (post.likedBy?.some(id => id.toString() === userId)) {
                setUserReaction("like");
            } else if (post.dislikedBy?.some(id => id.toString() === userId)) {
                setUserReaction("dislike");
            } else {
                setUserReaction(null);
            }
        }
    }, [auth, post]);

    const updateReactionState = (updatedPost) => {
        setLikes(updatedPost.likes);
        setDislikes(updatedPost.dislikes);
        if (auth && auth.user) {
            const userId = auth.user._id.toString();
            if (updatedPost.likedBy?.some(id => id.toString() === userId)) {
                setUserReaction("like");
            } else if (updatedPost.dislikedBy?.some(id => id.toString() === userId)) {
                setUserReaction("dislike");
            } else {
                setUserReaction(null);
            }
        }
    };

    const handleLike = async (e) => {
        e.stopPropagation();
        try {
            const response = await axios.post(
                `http://localhost:5000/api/posts/${post._id}/${userReaction === "like" ? "unlike" : "like"}`,
                {},
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            updateReactionState(response.data.post);
        } catch (err) {}
    };

    const handleDislike = async (e) => {
        e.stopPropagation();
        try {
            const response = await axios.post(
                `http://localhost:5000/api/posts/${post._id}/${userReaction === "dislike" ? "undislike" : "dislike"}`,
                {},
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            updateReactionState(response.data.post);
        } catch (err) {}
    };

    return (
        <div className="p-6 border border-gray-300 bg-white shadow-md rounded-lg hover:shadow-lg transition-shadow cursor-pointer" onClick={() => navigate(`/post/${post._id}`)}>
            {error && <p className="pWeb text-red-500 text-sm">{error}</p>}
            <h3 className="h3Web text-gray-800">
                {post.title}
                {post.isEdited && <span className="text-xs text-gray-500 ml-1">(editado)</span>}
            </h3>
            {post.author && !post.anonymous && (
                <p className="pWeb text-gray-500">
                    @{post.author.username} {post.author.isBanned && " (BANEADO)"}
                </p>
            )}
            <p className="pWeb text-xs text-gray-500">Publicado el {new Date(post.createdAt).toLocaleString()}</p>
            <p className="pWeb text-gray-700 mt-2">{post.description}</p>
            {post.image && (
                <div className="mt-3">
                    <img src={`http://localhost:5000/${post.image}`} alt="Imagen de la publicación" className="w-full rounded-lg" />
                </div>
            )}
            <div className="flex items-center space-x-6 mt-4">
                <button onClick={handleLike} className="flex items-center pWeb text-gray-600 hover:text-red-600 transition-colors">
                    <img src={userReaction === "like" ? likedImg : likeImg} alt="Like" className="w-6 h-6 mr-2" />
                    {likes}
                </button>
                <button onClick={handleDislike} className="flex items-center pWeb text-gray-600 hover:text-blue-600 transition-colors">
                    <img src={userReaction === "dislike" ? dislikedImg : dislikeImg} alt="Dislike" className="w-6 h-6 mr-2" />
                    {dislikes}
                </button>
                <span className="pWeb text-gray-600 text-sm">💬 Comentar</span>
            </div>
        </div>
    );
};

export default Post;
