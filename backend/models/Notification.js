const mongoose = require("mongoose");
const { v4: uuidv4 } = require("uuid");

const notificationSchema = new mongoose.Schema(
    {
        id: { type: String, default: uuidv4 },
        // Usuario que recibe la notificación (autor de la publicación o comentario)
        user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        // Tipo de notificación: like, dislike o comment
        type: { type: String, enum: ["like", "dislike", "comment"], required: true },
        // Publicación relacionada
        post: { type: mongoose.Schema.Types.ObjectId, ref: "Post", required: true },
        // Comentario relacionado (opcional, para reacciones a comentarios)
        comment: { type: mongoose.Schema.Types.ObjectId, ref: "Comment", default: null },
        // Usuario que realizó la acción (por ejemplo, el que dio like o comentó)
        actor: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        // Bandera para saber si la notificación ya fue leída
        isRead: { type: Boolean, default: false },
    },
    { timestamps: true }
);

module.exports = mongoose.model("Notification", notificationSchema);
