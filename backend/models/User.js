// backend/models/User.js
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4 },
    name: { type: String, required: [true, "El nombre es obligatorio"] },
    lastName: { type: String, required: [true, "El apellido es obligatorio"] },
    username: {
        type: String,
        required: [true, "El nombre de usuario es obligatorio"],
        unique: true,
    },
    address: { type: String, required: [true, "La dirección es obligatoria"] },
    postalCode: {
        type: String,
        required: [true, "El código postal es obligatorio"],
    },
    email: {
        type: String,
        required: [true, "El email es obligatorio"],
        unique: true,
    },
    password: {
        type: String,
        required: [true, "La contraseña es obligatoria"],
        match: [
            /^(?=.*[0-9])(?=.*[!@#$%^&*(),.\/:;'"]).{8,}$/,
            "La contraseña debe tener al menos 8 caracteres, incluir al menos un número y al menos un símbolo especial (, . / : ' ; etc.)",
        ],
    },
    profilePicture: { type: String, default: null },
    role: {
        type: String,
        default: "user",
        enum: ["user", "technician", "moderator", "admin"],
    },
    registrationDate: { type: Date, default: Date.now },
    status: { type: String, default: "active", enum: ["active", "inactive"] },
    isPremium: { type: Boolean, default: false },
    premiumExpiry: { type: Date, default: null },
    isBanned: { type: Boolean, default: false },
    banExpiration: { type: Date, default: null },
    banReason: { type: String, default: "" },
    /** Nuevo campo para baneo permanente **/
    isPermanentBan: { type: Boolean, default: false },
});

// Middleware para encriptar la contraseña
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Método para comparar contraseñas
userSchema.methods.comparePassword = async function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
