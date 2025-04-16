import React, { useState, useRef } from "react";
import { useChat } from "../hooks/useChat";
import { useAuth } from "../hooks/useAuth";
import axios from "axios";
import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";
import { markChatResolved, deleteChat, sendMessage } from "../services/chatService";

const Chat = () => {
    const { activeChat, messages, loadChatMessages, loadChats } = useChat();
    const { auth } = useAuth();
    const currentUser = auth?.user;
    const [input, setInput] = useState("");
    const [file, setFile] = useState(null);
    const [previewUrl, setPreviewUrl] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editingMessageText, setEditingMessageText] = useState("");

    const fileInputRef = useRef(null);

    const handleFileChange = (e) => {
        if (e.target.files && e.target.files[0]) {
            const selectedFile = e.target.files[0];
            setFile(selectedFile);
            setPreviewUrl(URL.createObjectURL(selectedFile));
        }
    };

    const refreshCurrentChat = async () => {
        if (activeChat && activeChat._id) {
            await loadChatMessages(activeChat._id);
            if (loadChats) await loadChats();
        }
    };

    const handleSend = async () => {
        if (!activeChat) return;
        // No enviar si no hay mensaje ni archivo
        if (input.trim() === "" && !file) return;

        let imageUrl = "";
        if (file) {
            setUploading(true);
            try {
                const uploadURL =
                    `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/uploads`;
                const formData = new FormData();
                formData.append("file", file);
                const uploadResponse = await axios.post(uploadURL, formData, {
                    headers: {
                        "Content-Type": "multipart/form-data",
                        Authorization: `Bearer ${auth.token}`,
                    },
                });
                imageUrl = uploadResponse.data.url;
            } catch (err) {
                console.error("Error uploading file:", err);
                setUploading(false);
                return;
            }
            setUploading(false);
        }

        try {
            if (editingMessageId) {
                await axios.put(
                    `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/chats/${activeChat._id}/messages/${editingMessageId}`,
                    { content: editingMessageText },
                    { headers: { Authorization: `Bearer ${auth.token}` } }
                );
                setEditingMessageId(null);
                setEditingMessageText("");
            } else {
                // Si el input es solo espacios en blanco, no se envía el campo content
                const contentToSend = input.trim() !== "" ? input : undefined;
                await sendMessage(activeChat._id, contentToSend, imageUrl);
            }
            setInput("");
            setFile(null);
            setPreviewUrl(null);
            refreshCurrentChat();
        } catch (err) {
            console.error("Error sending message:", err);
        }
    };

    const handleDeleteMessage = async (messageId) => {
        try {
            await axios.delete(
                `${import.meta.env.VITE_API_URL || "http://localhost:5000/api"}/chats/${activeChat._id}/messages/${messageId}`,
                { headers: { Authorization: `Bearer ${auth.token}` } }
            );
            refreshCurrentChat();
        } catch (err) {
            console.error("Error deleting message:", err);
        }
    };

    const handleEditMessage = (messageId, currentContent) => {
        setEditingMessageId(messageId);
        setEditingMessageText(currentContent);
    };

    const handleCancelEdit = () => {
        setEditingMessageId(null);
        setEditingMessageText("");
    };

    const canModifyMessage = (timestamp) => {
        const messageTime = new Date(timestamp);
        const oneHourLater = new Date(messageTime.getTime() + 60 * 60 * 1000);
        return new Date() < oneHourLater;
    };

    const getOtherParticipant = () => {
        if (!activeChat || !activeChat.participants) return "Sin participantes";
        const others = activeChat.participants.filter(
            (p) => p._id !== currentUser._id
        );
        return others.length > 0 ? others[0].username : "Sin participantes";
    };

    const handleToggleResolved = async () => {
        try {
            const newResolved = !activeChat.resolved;
            await markChatResolved(activeChat._id, newResolved);
            refreshCurrentChat();
        } catch (err) {
            console.error("Error toggling chat resolved:", err);
        }
    };

    const handleDeleteChat = async () => {
        try {
            await deleteChat(activeChat._id);
            loadChatMessages(null);
            if (loadChats) await loadChats();
        } catch (err) {
            console.error("Error deleting chat:", err);
        }
    };

    return (
        <div className="flex flex-col h-full">
            {/* Barra superior */}
            <div className="flex items-center justify-between p-3 bg-gray-200 border-b border-gray-300">
                <div className="pWeb text-lg font-bold">
                    Chat con {getOtherParticipant()}
                </div>
                <div className="flex gap-3">
                    {currentUser?.role === "admin" && (
                        <PrimaryButton
                            onClick={handleToggleResolved}
                            text={
                                activeChat?.resolved ? "Marcar como No Resuelto" : "Marcar como Resuelto"
                            }
                        />
                    )}
                    <SecondaryButton className="pWeb" onClick={handleDeleteChat} text="Borrar Chat" />
                </div>
            </div>
            <div className="flex-1 overflow-y-auto p-4 bg-gray-100">
                {messages && messages.length > 0 ? (
                    messages.map((msg, index) => {
                        const key = `${msg._id}-${index}`;
                        const isOwn =
                            currentUser && msg.sender && msg.sender._id === currentUser._id;
                        return (
                            <div
                                key={key}
                                className={`mb-2 p-2 rounded shadow ${isOwn ? "bg-blue-100" : "bg-gray-200"
                                    }`}
                            >
                                <div className="flex items-center justify-between">
                                    <span className="font-bold mr-2">
                                        {msg.sender?.username || "Desconocido"}:
                                    </span>
                                    {isOwn && canModifyMessage(msg.timestamp) && (
                                        <div className="flex gap-2">
                                            <button
                                                onClick={() => handleEditMessage(msg._id, msg.content)}
                                                className="pWeb text-sm text-blue-600 underline"
                                            >
                                                Editar
                                            </button>
                                            <button
                                                onClick={() => handleDeleteMessage(msg._id)}
                                                className="pWeb text-sm text-red-600 underline"
                                            >
                                                Borrar
                                            </button>
                                        </div>
                                    )}
                                </div>
                                {editingMessageId === msg._id ? (
                                    <div className="mt-1">
                                        <input
                                            type="text"
                                            value={editingMessageText}
                                            onChange={(e) => setEditingMessageText(e.target.value)}
                                            className="w-full p-2 border rounded"
                                        />
                                        <div className="mt-1 flex gap-2">
                                            <PrimaryButton onClick={handleSend} text="Aceptar" />
                                            <SecondaryButton onClick={handleCancelEdit} text="Cancelar" />
                                        </div>
                                    </div>
                                ) : (
                                    msg.content && <div>{msg.content}</div>
                                )}
                                {msg.image && (
                                    <img
                                        src={msg.image}
                                        alt="Adjunto"
                                        className="max-w-xs max-h-40 mt-2 border rounded"
                                    />
                                )}
                                <div className="text-xs text-gray-500">
                                    {new Date(msg.timestamp).toLocaleTimeString()}
                                </div>
                            </div>
                        );
                    })
                ) : (
                    <div className="pWeb text-center text-gray-500">
                        No hay mensajes en este chat.
                    </div>
                )}
            </div>
            <div className="mt-2 flex flex-col">
                <div className="flex">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        className="pWeb flex-1 p-2 border border-gray-300 rounded-l-md focus:outline-none"
                        placeholder="Escribe un mensaje..."
                    />
                    <button
                        onClick={handleSend}
                        className="pWeb bg-blue-500 text-white px-4 py-2 rounded-r-md hover:bg-blue-600 focus:outline-none"
                        disabled={uploading}
                    >
                        {uploading ? "Subiendo..." : "Enviar"}
                    </button>
                </div>
                {/* Contenedor para subir imagen con preview */}
                <div className="mt-2">
                    <div
                        className="cursor-pointer flex items-center justify-center w-48 h-12 bg-gray-200 rounded-lg hover:bg-gray-300 transition"
                        onClick={() => fileInputRef.current.click()}
                    >
                        <input
                            type="file"
                            name="image"
                            accept="image/*"
                            onChange={handleFileChange}
                            ref={fileInputRef}
                            style={{ display: "none" }}
                        />
                        {previewUrl ? (
                            <img
                                src={previewUrl}
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
                                <span className="pWeb">Subir Imagen</span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Chat;
