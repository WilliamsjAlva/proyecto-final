import { useContext } from 'react';
import { ChatContext } from '../contexts/ChatContext.jsx';

export const useChat = () => {
    return useContext(ChatContext);
};
