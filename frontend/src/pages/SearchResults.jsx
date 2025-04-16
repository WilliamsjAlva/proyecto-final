/* eslint-disable */
import React, { useState, useEffect, useContext } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { AuthContext } from "../contexts/AuthContext";
import Post from "../components/Post";

const SearchResults = () => {
    const { query } = useParams();
    const { auth } = useContext(AuthContext);
    const [posts, setPosts] = useState([]);
    const [error, setError] = useState("");
    const [page, setPage] = useState(1);
    const [hasMore, setHasMore] = useState(true);
    const [loading, setLoading] = useState(false);
    const limit = 10;

    const loadPosts = async () => {
        setLoading(true);
        try {
            const response = await axios.get(
                `http://localhost:5000/api/posts?page=${page}&limit=${limit}&search=${encodeURIComponent(query)}`,
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            const fetchedPosts = response.data.posts;
            if (page === 1) {
                setPosts(fetchedPosts);
            } else {
                setPosts((prevPosts) => [...prevPosts, ...fetchedPosts]);
            }
            setHasMore(fetchedPosts.length === limit);
        } catch (err) {
            console.error("Error al cargar publicaciones:", err);
            setError("Error al cargar publicaciones. Inténtalo de nuevo más tarde.");
        }
        setLoading(false);
    };

    useEffect(() => {
        setPage(1);
        loadPosts();
    }, [query, auth.token]);

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-3xl font-bold mb-6">Resultados de búsqueda: "{query}"</h1>
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
};

export default SearchResults;
