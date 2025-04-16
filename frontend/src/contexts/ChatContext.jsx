/* eslint-disable */
import React, { createContext, useState, useEffect } from 'react';
import * as chatService from '../services/chatService';

export const ChatContext = createContext();

export const ChatProvider = ({ children }) => {
    const [chats, setChats] = useState([]);
    const [activeChat, setActiveChat] = useState(null);
    const [messages, setMessages] = useState([]);

    const loadChats = async () => {
        try {
            const data = await chatService.getChats();
            if (Array.isArray(data)) {
                setChats(data);
            } else {
                console.error("Error en loadChats: respuesta no es un arreglo", data);
                setChats([]);
            }
        } catch (error) {
            console.error("Error loading chats:", error);
            setChats([]);
        }
    };

    const loadChatMessages = async (chatId) => {
        try {
            const chat = await chatService.getChat(chatId);
            setActiveChat(chat);
            setMessages(chat.messages || []);
        } catch (error) {
            console.error("Error loading chat messages:", error);
        }
    };

    const sendMessage = async (chatId, content) => {
        try {
            const newMessage = await chatService.sendMessage(chatId, content);
            setMessages((prev) => [...prev, newMessage]);
        } catch (error) {
            console.error("Error sending message:", error);
        }
    };

    useEffect(() => {
        loadChats();
    }, []);

    return (
        <ChatContext.Provider
            value={{
                chats,
                activeChat,
                messages,
                setActiveChat,
                loadChatMessages,
                sendMessage,
                loadChats,
            }}
        >
            {children}
        </ChatContext.Provider>
    );
};
