const User = require("../models/User");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail } = require("../utils/email");

exports.registerUser = async (req, res) => {
    try {
        const { name, lastName, username, address, postalCode, email, password, profilePicture } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser)
            return res.status(400).json({ message: "El correo ya está registrado." });

        const user = new User({
            name,
            lastName,
            username,
            address,
            postalCode,
            email,
            password,
            profilePicture,
            isPremium: false,
            premiumExpiry: null,
        });

        await user.save();

        await sendWelcomeEmail(user.email, user.name);

        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error("Error en el registro:", error);
        res.status(500).json({ message: "Error al registrar el usuario. Inténtalo de nuevo más tarde" });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findOne({ username });
        if (!user)
            return res.status(400).json({ message: "Credenciales inválidas." });

        const isMatch = await user.comparePassword(password);
        if (!isMatch)
            return res.status(400).json({ message: "Credenciales inválidas." });

        if (user.isBanned) {
            let banMsg = "Su cuenta ha sido baneada.";
            if (user.banExpiration && new Date(user.banExpiration) > new Date()) {
                const banUntil = new Date(user.banExpiration).toLocaleDateString("es-ES");
                banMsg = `Su cuenta ha sido baneada hasta el ${banUntil}.`;
            }
            return res.status(403).json({ message: banMsg });
        }

        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Inicio de sesión exitoso",
            token,
            user: {
                _id: user._id,
                name: user.name,
                lastName: user.lastName,
                username: user.username,
                email: user.email,
                role: user.role,
                isPremium: user.isPremium,
                premiumExpiry: user.premiumExpiry,
            },
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al iniciar sesión" });
    }
};
