const User = require("../models/User");
const jwt = require("jsonwebtoken");

exports.registerUser = async (req, res) => {
    try {
        const { name, lastName, username, address, postalCode, email, password, profilePicture } = req.body;

        const existingUser = await User.findOne({ email });
        if (existingUser) return res.status(400).json({ message: "El correo ya está registrado." });

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

        res.status(201).json({ message: "Usuario registrado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al registrar el usuario. Inténtalo de nuevo más tarde" });
    }
};

exports.loginUser = async (req, res) => {
    try {
        const { username, password } = req.body;

        // Busca al usuario por username
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: "Credenciales inválidas." });

        // Compara la contraseña
        const isMatch = await user.comparePassword(password);
        if (!isMatch) return res.status(400).json({ message: "Credenciales inválidas." });

        // Firma el token usando user._id
        const token = jwt.sign(
            { id: user._id, role: user.role },
            process.env.JWT_SECRET,
            { expiresIn: "1d" }
        );

        res.json({
            message: "Inicio de sesión exitoso",
            token,
            user: {
                id: user._id,
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
