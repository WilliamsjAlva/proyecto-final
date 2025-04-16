import React, { useState } from 'react';
import { useChat } from '../hooks/useChat';
import { useAuth } from '../hooks/useAuth';
import { createChat, deleteChat } from '../services/chatService';
import PrimaryButton from './PrimaryButton';
import SecondaryButton from './SecondaryButton';

const ChatList = () => {
  const { chats, loadChatMessages, loadChats } = useChat();
  const { auth } = useAuth();
  const user = auth?.user;

  // Separar chats en activos y resueltos
  const activeChats = chats ? chats.filter(chat => !chat.resolved) : [];
  const resolvedChats = chats ? chats.filter(chat => chat.resolved) : [];

  // Estados para paginación de chats activos
  const [chatPage, setChatPage] = useState(1);
  const chatsPerPage = 5;
  const totalChatPages = activeChats ? Math.ceil(activeChats.length / chatsPerPage) : 1;
  const indexOfLastChat = chatPage * chatsPerPage;
  const indexOfFirstChat = indexOfLastChat - chatsPerPage;
  const currentActiveChats = activeChats ? activeChats.slice(indexOfFirstChat, indexOfLastChat) : [];

  const handleChatClick = (chatId) => {
    loadChatMessages(chatId);
  };

  const handleDeleteChat = async (chatId) => {
    try {
      await deleteChat(chatId);
      loadChats();
    } catch (error) {
      console.error("Error deleting chat:", error);
    }
  };

  const handleChatPrevPage = () => {
    if (chatPage > 1) setChatPage(chatPage - 1);
  };

  const handleChatNextPage = () => {
    if (chatPage < totalChatPages) setChatPage(chatPage + 1);
  };

  const handleStartChat = async (otherUserId) => {
    try {
      const chat = await createChat(otherUserId);
      if (chat && chat._id) {
        loadChatMessages(chat._id);
      }
    } catch (error) {
      console.error("Error starting chat:", error);
    }
  };

  // Estados y funciones para la búsqueda de usuarios premium
  const [premiumResults, setPremiumResults] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [page, setPage] = useState(1);
  const [totalPagesPremium, setTotalPagesPremium] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [searchError, setSearchError] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);

  const fetchPremiumUsersPaginated = async (page) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return { users: [], totalPages: 1 };
      const response = await fetch(
        `/api/users/premium?search=&page=${page}&limit=5`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      return data;
    } catch (err) {
      console.error("Error fetching premium users:", err);
      setSearchError("No se pudieron cargar los usuarios premium.");
      return { users: [], totalPages: 1 };
    }
  };

  const fetchAllPremiumUsers = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;
      const response = await fetch(
        `/api/users/premium?search=&limit=1000`,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const data = await response.json();
      const allUsers = Array.isArray(data) ? data : data.users || [];
      const filtered = allUsers.filter(u =>
        u.username.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setPremiumResults(filtered);
    } catch (err) {
      console.error("Error fetching premium users:", err);
      setSearchError("No se pudieron cargar los usuarios premium.");
      setPremiumResults([]);
    }
  };

  const handleSearch = async () => {
    setSearchError(null);
    setPage(1);
    if (searchQuery.trim() === "") {
      const data = await fetchPremiumUsersPaginated(1);
      if (data) {
        setPremiumResults(data.users);
        setTotalPagesPremium(data.totalPages || 1);
        setHasMore(data.totalPages > 1);
      }
    } else {
      await fetchAllPremiumUsers();
    }
  };

  return (
    <div className="chat-list p-4">
      {/* Sección "Tus Chats Activos" */}
      <h1 className="h1Web font-semibold mb-2">Tus Chats Activos</h1>
      {activeChats && activeChats.length > 0 ? (
        <>
          <ul className="space-y-2">
            {currentActiveChats.map((chat) => (
              <li
                key={chat._id}
                className="flex justify-between items-center p-2 bg-white rounded shadow hover:bg-gray-50"
                onClick={() => handleChatClick(chat._id)}
              >
                <span>
                  {chat.participants
                    .filter((p) => p._id !== user._id)
                    .map((p) => p.username)
                    .join(', ') || 'Chat'}
                </span>
                <SecondaryButton onClick={() => handleDeleteChat(chat._id)} text="Borrar" />
              </li>
            ))}
          </ul>
          <div className="mt-2 flex justify-between items-center">
            <button
              onClick={handleChatPrevPage}
              disabled={chatPage <= 1}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded disabled:opacity-50"
            >
              Anterior
            </button>
            <span className="text-sm">
              Página {chatPage} de {totalChatPages}
            </span>
            <button
              onClick={handleChatNextPage}
              disabled={chatPage >= totalChatPages}
              className="bg-gray-300 text-gray-700 px-3 py-1 rounded disabled:opacity-50"
            >
              Siguiente
            </button>
          </div>
        </>
      ) : (
        <p className="text-gray-500">No tienes chats activos.</p>
      )}

      {/* Sección "Chats Resueltos" */}
      {resolvedChats && resolvedChats.length > 0 && (
        <div className="mt-6">
          <h1 className="h1Web font-semibold mb-2">Chats Resueltos</h1>
          <ul className="space-y-2">
            {resolvedChats.map((chat) => (
              <li
                key={chat._id}
                className="cursor-pointer p-2 bg-white rounded shadow hover:bg-gray-50"
                onClick={() => handleChatClick(chat._id)}
              >
                {chat.participants
                  .filter((p) => p._id !== user._id)
                  .map((p) => p.username)
                  .join(', ') || 'Chat'}
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Sección de Búsqueda de Usuarios Premium - solo para administradores */}
      {user?.role === "admin" && (
        <div className="mt-6">
          <h3 className="h3Web font-semibold mb-2">Buscar Usuarios</h3>
          <div className="flex items-center space-x-2 mb-2">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Buscar usuario..."
              className="p-2 border rounded w-full"
            />
            <SecondaryButton onClick={handleSearch} text="Buscar" />
          </div>
          {searchError && <p className="text-red-500">{searchError}</p>}
          {premiumResults && premiumResults.length > 0 ? (
            <ul className="space-y-2">
              {premiumResults.map((premiumUser) => (
                <li
                  key={premiumUser._id}
                  className="flex justify-between items-center p-2 bg-white rounded shadow"
                >
                  <span>
                    {premiumUser.username}{" "}
                    {premiumUser.isPremium ? "(premium activo)" : "(no premium)"}
                  </span>
                  <button
                    onClick={() => handleStartChat(premiumUser._id)}
                    className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600"
                  >
                    Iniciar Chat
                  </button>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-500">No se encontraron usuarios premium.</p>
          )}
        </div>
      )}
    </div>
  );
};

export default ChatList;
