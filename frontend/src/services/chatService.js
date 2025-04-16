import { getToken } from './authService';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const getChats = async () => {
  const token = getToken();
  const response = await fetch(`${API_URL}/chats`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

export const getChat = async (chatId) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/chats/${chatId}`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.json();
};

export const sendMessage = async (chatId, content, image) => {
  const token = getToken();
  // Construir el objeto 'body' sin incluir 'image' si no es válida
  const body = {};
  // Solo incluir 'content' si tiene un valor no vacío
  if (content && content.trim().length > 0) {
    body.content = content;
  }
  // Solo agregar 'image' si es una cadena válida (no vacía)
  if (image && image.trim().length > 0) {
    body.image = image;
  }

  const response = await fetch(`${API_URL}/chats/${chatId}/messages`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(body),
  });
  return response.json();
};

export const createChat = async (participantId) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/chats`, {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ participantId }),
  });
  return response.json();
};

export const markChatResolved = async (chatId, resolved) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/chats/${chatId}/resolve`, {
    method: 'PUT',
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ resolved })
  });
  return response.json();
};

export const deleteChat = async (chatId) => {
  const token = getToken();
  const response = await fetch(`${API_URL}/chats/${chatId}`, {
    method: 'DELETE',
    headers: {
      Authorization: `Bearer ${token}`
    }
  });
  return response.json();
};
