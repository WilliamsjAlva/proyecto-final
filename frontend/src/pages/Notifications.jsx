import React, { useEffect, useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext.jsx";
import notificationsService from "../services/notificationsService";

const Notifications = () => {
    const { auth } = useContext(AuthContext);
    const navigate = useNavigate();
    const [notifications, setNotifications] = useState([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const notificationsPerPage = 10;

    const fetchNotifications = async () => {
        try {
            const response = await notificationsService.getNotifications();
            // Filtrar las notificaciones para descartar aquellas sin post (publicación eliminada)
            const validNotifications = (response.notifications || []).filter(
                (notif) => notif.post
            );
            setNotifications(validNotifications);
        } catch (error) {
            console.error("Error al obtener notificaciones", error);
        }
    };

    useEffect(() => {
        if (auth) {
            fetchNotifications();
        }
    }, [auth]);

    const handleMarkAsRead = async (id) => {
        try {
            await notificationsService.markAsRead(id);
            fetchNotifications();
        } catch (error) {
            console.error("Error al marcar notificación", error);
        }
    };

    const handleMarkAllAsRead = async () => {
        try {
            await notificationsService.markAllAsRead();
            fetchNotifications();
        } catch (error) {
            console.error("Error al marcar todas las notificaciones", error);
        }
    };

    const handleNotificationClick = (notif) => {
        if (notif?.post?._id) {
            if (notif.type === "like" || notif.type === "dislike") {
                // Si existe notif.comment, se navega a la publicación con query de comentario
                if (notif.comment?._id) {
                    navigate(`/post/${notif.post._id}?commentId=${notif.comment._id}`);
                } else {
                    navigate(`/post/${notif.post._id}`);
                }
            } else if (notif.type === "comment") {
                const commentId = notif.comment?._id || "";
                navigate(`/post/${notif.post._id}?commentId=${commentId}`);
            }
        }
        handleMarkAsRead(notif._id);
    };

    // Filtrar notificaciones según el título de la publicación o el texto del comentario (si existe)
    const filteredNotifications = notifications.filter((notif) => {
        const displayText = notif.comment
            ? notif.comment.text || ""
            : notif?.post?.title || "";
        return displayText.toLowerCase().includes(searchQuery.toLowerCase());
    });

    // Paginación
    const indexOfLast = currentPage * notificationsPerPage;
    const indexOfFirst = indexOfLast - notificationsPerPage;
    const currentNotifications = filteredNotifications.slice(indexOfFirst, indexOfLast);
    const totalPages = Math.ceil(filteredNotifications.length / notificationsPerPage);

    const handleNextPage = () => {
        if (currentPage < totalPages) setCurrentPage((prev) => prev + 1);
    };

    const handlePrevPage = () => {
        if (currentPage > 1) setCurrentPage((prev) => prev - 1);
    };

    const handleSearchChange = (e) => {
        setSearchQuery(e.target.value);
        setCurrentPage(1);
    };

    return (
        <div className="notifications-page p-5">
            <h1 className="text-2xl font-bold mb-4">Notificaciones</h1>
            <div className="mb-4">
                <button
                    onClick={handleMarkAllAsRead}
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                    Marcar todas como leídas
                </button>
            </div>
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Buscar por título o comentario"
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full max-w-md px-3 py-2 border border-gray-300 rounded focus:outline-none focus:border-blue-500"
                />
            </div>
            {filteredNotifications.length === 0 ? (
                <p>No tienes notificaciones.</p>
            ) : (
                <>
                    <ul className="space-y-3">
                        {currentNotifications.map((notif) => {
                            // Si hay comentario, mostramos su texto; de lo contrario, el título de la publicación.
                            const displayText = notif.comment
                                ? notif.comment.text || "Comentario sin texto"
                                : notif?.post?.title || "Publicación eliminada";
                            let accion = "";
                            if (notif.type === "like" || notif.type === "dislike") {
                                accion = notif.comment
                                    ? (notif.type === "like"
                                        ? "le dio like a tu comentario"
                                        : "le dio dislike a tu comentario")
                                    : (notif.type === "like"
                                        ? "le dio like a tu publicación"
                                        : "le dio dislike a tu publicación");
                            } else if (notif.type === "comment") {
                                accion = "comentó en tu publicación";
                            }
                            return (
                                <li
                                    key={notif._id}
                                    className={`p-4 rounded cursor-pointer ${notif.isRead ? "bg-gray-100" : "bg-blue-100"
                                        } border border-gray-300`}
                                    onClick={() => handleNotificationClick(notif)}
                                >
                                    <p>
                                        <strong>{notif.actor?.username || "Usuario desconocido"}</strong>{" "}
                                        {accion} : <strong>{displayText}</strong>
                                    </p>
                                </li>
                            );
                        })}
                    </ul>
                    <div className="flex justify-center items-center gap-4 mt-6">
                        <button
                            onClick={handlePrevPage}
                            disabled={currentPage === 1}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            Prev
                        </button>
                        <span>
                            Página {currentPage} de {totalPages}
                        </span>
                        <button
                            onClick={handleNextPage}
                            disabled={currentPage === totalPages}
                            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
                        >
                            Next
                        </button>
                    </div>
                </>
            )}
        </div>
    );
};

export default Notifications;
