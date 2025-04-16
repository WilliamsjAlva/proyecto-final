const Notification = require("../models/Notification");

// Obtener notificaciones para el usuario logueado
exports.getNotifications = async (req, res) => {
    try {
        const notifications = await Notification.find({ user: req.user.id })
            .populate("actor", "username")
            .populate("post", "title")
            .populate("comment", "text");
        res.json({ notifications });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener las notificaciones" });
    }
};


// Marcar una notificación como leída
exports.markAsRead = async (req, res) => {
    try {
        const notificationId = req.params.id;
        const notification = await Notification.findById(notificationId);
        if (!notification) {
            return res.status(404).json({ message: "Notificación no encontrada" });
        }
        if (notification.user.toString() !== req.user.id) {
            return res.status(403).json({ message: "No tienes permisos para modificar esta notificación" });
        }
        notification.isRead = true;
        await notification.save();
        res.json({ message: "Notificación marcada como leída", notification });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar la notificación" });
    }
};

// Marcar todas las notificaciones como leídas
exports.markAllAsRead = async (req, res) => {
    try {
        await Notification.updateMany({ user: req.user.id, isRead: false }, { isRead: true });
        res.json({ message: "Todas las notificaciones marcadas como leídas" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar las notificaciones" });
    }
};
