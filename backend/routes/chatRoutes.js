const express = require('express');
const router = express.Router();
const chatController = require('../controllers/chatController');
const authMiddleware = require('../middleware/authMiddleware');
const User = require('../models/User');

// Middleware para verificar acceso premium
const premiumChatAccess = async (req, res, next) => {
    try {
        const allowedRoles = ['admin', 'technician', 'moderator'];
        if (allowedRoles.includes(req.user.role)) {
            return next();
        }
        // Para usuarios con rol "user", verificamos el flag isPremium
        const user = await User.findById(req.user.id);
        if (user && user.isPremium) return next();
        return res.status(403).json({ message: 'Acceso restringido a usuarios premium o roles autorizados' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error verificando acceso premium' });
    }
};

// Todas las rutas de chat requieren autenticación y acceso premium
router.use(authMiddleware, premiumChatAccess);

router.get('/', chatController.getChats);
router.get('/:chatId', chatController.getChat);
router.post('/', chatController.createChat);
router.post('/:chatId/messages', chatController.sendMessage);

// Endpoints para mensajes
router.put('/:chatId/messages/:messageId', chatController.editMessage);
router.delete('/:chatId/messages/:messageId', chatController.deleteMessage);

// Endpoint para alternar estado resuelto
router.put('/:chatId/resolve', chatController.resolveChat);

// Endpoint para borrar chat
router.delete('/:chatId', chatController.deleteChat);

module.exports = router;
