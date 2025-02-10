import React, { useState, useEffect } from "react";
import axios from "axios";

const Chat = ({ post }) => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");

    const loadMessages = async () => {
        try {
            const response = await axios.get(`http://localhost:5000/api/chats/${post.id}`);
            setMessages(response.data.messages);
        } catch (error) {
            console.error("Error al cargar mensajes:", error);
        }
    };

    useEffect(() => {
        loadMessages();
    }, [post.id]);

    const sendMessage = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`http://localhost:5000/api/chats/${post.id}`, { message: input });
            setMessages([...messages, response.data.message]);
            setInput("");
        } catch (error) {
            console.error("Error al enviar mensaje:", error);
        }
    };

    return (
        <div className="mt-4 border-t pt-2">
            <h3 className="font-bold mb-2">Chat Privado</h3>
            <div className="mb-2 h-32 overflow-y-auto border p-2">
                {messages.map((msg, index) => (
                    <p key={index} className="mb-1">{msg.text}</p>
                ))}
            </div>
            <form onSubmit={sendMessage} className="flex">
                <input
                    type="text"
                    className="flex-grow border rounded-l px-2 py-1"
                    placeholder="Escribe un mensaje..."
                    value={input}
                    onChange={(e) => setInput(e.target.value)}
                    required
                />
                <button type="submit" className="bg-blue-500 text-white px-4 rounded-r">
                    Enviar
                </button>
            </form>
        </div>
    );
};

export default Chat;
