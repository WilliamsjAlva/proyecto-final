const Chat = require('../models/chatModel');
const User = require('../models/User');

// Obtener todos los chats en los que participa el usuario autenticado
exports.getChats = async (req, res) => {
    try {
        const chats = await Chat.find({ participants: req.user.id })
            .populate('participants', 'username');
        res.json(chats);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error obteniendo chats' });
    }
};

// Obtener un chat en específico (con mensajes y participantes)
exports.getChat = async (req, res) => {
    try {
        const chat = await Chat.findById(req.params.chatId)
            .populate('participants', 'username')
            .populate('messages.sender', 'username');
        if (!chat)
            return res.status(404).json({ message: 'Chat no encontrado' });
        // Verificar que el usuario pertenezca a este chat
        if (!chat.participants.some(p => p._id.toString() === req.user.id)) {
            return res.status(403).json({ message: 'No tienes acceso a este chat' });
        }
        // Si el usuario borró el chat, filtrar los mensajes antiguos
        const deletionInfo = chat.deletedFor.find(entry => entry.user.toString() === req.user.id);
        if (deletionInfo) {
            chat.messages = chat.messages.filter(msg => new Date(msg.timestamp) > new Date(deletionInfo.deletedAt));
        }
        res.json(chat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error obteniendo el chat' });
    }
};

// Crear un chat nuevo entre el usuario autenticado y otro participante
exports.createChat = async (req, res) => {
    try {
        const { participantId } = req.body;
        // Si ya existe un chat entre ambos, se devuelve ese chat
        let chat = await Chat.findOne({
            participants: { $all: [req.user.id, participantId] }
        });
        if (chat) return res.json(chat);

        chat = new Chat({
            participants: [req.user.id, participantId],
            messages: []
        });
        await chat.save();
        res.status(201).json(chat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creando el chat' });
    }
};

// Enviar un mensaje en un chat determinado
exports.sendMessage = async (req, res) => {
    try {
        const { chatId } = req.params;
        const { content, image } = req.body;
        const chat = await Chat.findById(chatId);
        if (!chat)
            return res.status(404).json({ message: 'Chat no encontrado' });

        // Verificar que el usuario sea parte del chat
        if (!chat.participants.some(p => p.toString() === req.user.id)) {
            return res.status(403).json({ message: 'No tienes acceso a este chat' });
        }

        const message = { sender: req.user.id, content, image };
        chat.messages.push(message);
        await chat.save();

        // Poblar el campo sender para devolver el nombre de usuario
        await chat.populate('messages.sender', 'username');
        const newMessage = chat.messages[chat.messages.length - 1];

        // Si el usuario tenía el chat "borrado", se remueve su marca para poder ver mensajes futuros
        chat.deletedFor = chat.deletedFor.filter(entry => entry.user.toString() !== req.user.id);
        await chat.save();

        res.status(201).json(newMessage);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error enviando el mensaje' });
    }
};

// Editar un mensaje (PUT /api/chats/:chatId/messages/:messageId)
exports.editMessage = async (req, res) => {
    try {
        const { chatId, messageId } = req.params;
        const { content } = req.body;
        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: "Chat no encontrado" });

        // Si el usuario ha borrado el chat, es posible que el mensaje que intenta editar ya no se encuentre en el listado
        const deletionInfo = chat.deletedFor.find(entry => entry.user.toString() === req.user.id);
        let message;
        if (deletionInfo) {
            // Buscar solo en los mensajes posteriores a la fecha de borrado
            message = chat.messages.find(m =>
                m._id.toString() === messageId && new Date(m.timestamp) > new Date(deletionInfo.deletedAt)
            );
        } else {
            message = chat.messages.id(messageId);
        }
        if (!message) return res.status(404).json({ message: "Mensaje no encontrado" });
        if (message.sender.toString() !== req.user.id) {
            return res.status(403).json({ message: "No tienes permiso para editar este mensaje" });
        }
        message.content = content;
        // Opcional: actualizar el timestamp para reflejar la edición (si lo deseas)
        message.timestamp = new Date();
        await chat.save();
        await chat.populate('messages.sender', 'username');
        res.json(message);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error editando el mensaje" });
    }
};

// Borrar un mensaje (DELETE /api/chats/:chatId/messages/:messageId)
exports.deleteMessage = async (req, res) => {
    try {
        const { chatId, messageId } = req.params;
        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: "Chat no encontrado" });
        const messageToDelete = chat.messages.find(m => m._id.toString() === messageId);
        if (!messageToDelete) return res.status(404).json({ message: "Mensaje no encontrado" });
        if (messageToDelete.sender.toString() !== req.user.id) {
            return res.status(403).json({ message: "No tienes permiso para borrar este mensaje" });
        }
        chat.messages = chat.messages.filter(m => m._id.toString() !== messageId);
        await chat.save();
        res.json({ message: "Mensaje borrado" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error borrando el mensaje" });
    }
};

// Alternar el estado "resuelto" del chat (PUT /api/chats/:chatId/resolve)
exports.resolveChat = async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const { resolved } = req.body;
        const chat = await Chat.findByIdAndUpdate(
            chatId,
            { resolved },
            { new: true }
        );
        if (!chat) return res.status(404).json({ message: "Chat no encontrado" });
        res.json(chat);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error actualizando el estado del chat" });
    }
};

// Borrar un chat "para si mismo"
// En lugar de remover al usuario de los participantes (para conservar los nombres),
// se registra la fecha en que el usuario lo borra (ocultando mensajes previos).
exports.deleteChat = async (req, res) => {
    try {
        const chatId = req.params.chatId;
        const userId = req.user.id;
        const chat = await Chat.findById(chatId);
        if (!chat) return res.status(404).json({ message: "Chat no encontrado" });
        // Agregar o actualizar el registro de borrado para este usuario
        const existing = chat.deletedFor.find(entry => entry.user.toString() === userId);
        if (existing) {
            existing.deletedAt = new Date();
        } else {
            chat.deletedFor.push({ user: userId, deletedAt: new Date() });
        }
        await chat.save();
        res.json({ message: "Chat borrado para ti" });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Error al borrar chat" });
    }
};
