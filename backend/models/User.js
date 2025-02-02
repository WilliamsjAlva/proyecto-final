const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

const userSchema = new mongoose.Schema({
    id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    lastName: { type: String, required: true },
    username: { type: String, required: true, unique: true },
    address: { type: String, required: true },
    postalCode: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: null },
    role: { type: String, default: "user", enum: ["user", "technician", "moderator", "admin"] },
    registrationDate: { type: Date, default: Date.now },
    status: { type: String, default: "active", enum: ["active", "inactive"] },
    isPremium: { type: Boolean, default: false },
    premiumExpiry: { type: Date, default: null },
});

// Encriptar contraseña antes de guardar
userSchema.pre("save", async function (next) {
    if (!this.isModified("password")) return next();
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Comparar contraseñas para login
userSchema.methods.comparePassword = async function (inputPassword) {
    return bcrypt.compare(inputPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
