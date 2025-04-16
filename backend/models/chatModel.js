const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const messageSchema = new Schema({
    sender: { type: Schema.Types.ObjectId, ref: 'User', required: true },
    content: {
        type: String,
        required: function () {
            // Si se proporciona una imagen válida (cadena no vacía), no se requiere contenido.
            return !(this.image && this.image.trim().length > 0);
        },
        validate: {
            validator: function (v) {
                // Si hay imagen válida, se omite la validación del contenido.
                if (this.image && this.image.trim().length > 0) return true;
                return v && v.trim().length > 0;
            },
            message: "El mensaje debe tener contenido o una imagen."
        }
    },
    image: { type: String },
    timestamp: { type: Date, default: Date.now }
});

const chatSchema = new Schema(
    {
        participants: [{ type: Schema.Types.ObjectId, ref: 'User', required: true }],
        messages: [messageSchema],
        resolved: { type: Boolean, default: false },
        // Nuevo campo para registrar cuándo un usuario "borra" el chat (ocultando mensajes previos)
        deletedFor: [{
            user: { type: Schema.Types.ObjectId, ref: 'User' },
            deletedAt: { type: Date }
        }]
    },
    { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);
