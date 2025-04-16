// src/pages/PremiumChatPage.jsx
import React from "react";
import ChatList from "../components/ChatList";
import Chat from "../components/Chat";
import { useChat } from "../hooks/useChat";

const PremiumChatPage = () => {
    const { activeChat } = useChat();

    return (
        <div className="flex h-screen">
            {/* Sidebar: lista de chats y usuarios premium */}
            <div className="w-1/3 border-r border-gray-300 p-4 overflow-y-auto bg-gray-50">
                <ChatList />
            </div>
            {/* Área de chat */}
            <div className="flex-1 p-4 flex flex-col bg-white">
                {activeChat ? (
                    <Chat />
                ) : (
                    <div className="flex-1 flex items-center justify-center text-gray-500">
                        Selecciona un chat para iniciar la conversación.
                    </div>
                )}
            </div>
        </div>
    );
};

export default PremiumChatPage;
