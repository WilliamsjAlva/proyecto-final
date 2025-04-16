/* eslint-disable */
import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Post from "../components/Post";
import NewPostForm from "../components/NewPostForm";
import { AuthContext } from "../contexts/AuthContext";
import '../styles/text.css';
import SecondaryButton from "../components/SecondaryButton";

const Feed = () => {
    const { auth } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const loadPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:5000/api/posts?page=${page}&limit=10`,
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            const fetchedPosts = response.data.posts;
            if (fetchedPosts.length < 10) {
                setHasMore(false);
            }
            setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
        } catch (err) {
            console.error("Error al cargar tickets:", err);
            setError("Error al cargar tickets. Inténtalo de nuevo más tarde.");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadPosts();
    }, [page]);

    return (
        <div className="container mx-auto p-4 pl-20 pr-20">
            <h1 className="h2Web text-center p-4">Feed de Tickets</h1> {/* Añadido text-center */}
            <NewPostForm onPostCreated={(newPost) => setPosts([newPost, ...posts])} />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="space-y-4">
                {posts.map((post) => (
                    <Post key={post._id} post={post} />
                ))}
            </div>
            {loading && <p className="pWeb">Cargando tickets...</p>}
            {hasMore && !loading && (
                <SecondaryButton
                    className="mt-4 px-4 py-2 text-black rounded"
                    onClick={() => setPage(page + 1)}
                    text="Cargar más"
                />
            )}
        </div>
    );
}

export default Feed;
