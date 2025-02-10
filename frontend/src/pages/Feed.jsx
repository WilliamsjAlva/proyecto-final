import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import Post from "../components/Post";
import NewPostForm from "../components/NewPostForm";
import { AuthContext } from "../contexts/AuthContext";

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
            console.error("Error al cargar publicaciones:", err);
            setError("Error al cargar publicaciones. Inténtalo de nuevo más tarde.");
        }
        setLoading(false);
    };

    useEffect(() => {
        loadPosts();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [page]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Feed de Publicaciones</h1>
            <NewPostForm onPostCreated={(newPost) => setPosts([newPost, ...posts])} />
            {error && <p className="text-red-500 mb-4">{error}</p>}
            <div className="space-y-4">
                {posts.map((post) => (
                    <Post key={post._id} post={post} />
                ))}
            </div>
            {loading && <p>Cargando publicaciones...</p>}
            {hasMore && !loading && (
                <button
                    className="mt-4 px-4 py-2 bg-blue-500 text-white rounded"
                    onClick={() => setPage(page + 1)}
                >
                    Cargar más
                </button>
            )}
        </div>
    );
}

export default Feed;
