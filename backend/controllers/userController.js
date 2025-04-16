const User = require("../models/User");

exports.getUsers = async (req, res) => {
    try {
        const { search = "", page = 1, limit = 10 } = req.query;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { username: { $regex: search, $options: "i" } },
                    { email: { $regex: search, $options: "i" } }
                ]
            };
        }
        const totalUsers = await User.countDocuments(query);
        const totalPages = Math.ceil(totalUsers / Number(limit));
        const users = await User.find(query)
            .skip((page - 1) * Number(limit))
            .limit(Number(limit));
        res.json({ users, totalPages });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener usuarios." });
    }
};

exports.getUserById = async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user)
            return res.status(404).json({ message: "Usuario no encontrado" });
        res.json({ user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al obtener el usuario." });
    }
};

exports.getPremiumUsers = async (req, res) => {
    try {
        const premiumUsers = await User.find({ isPremium: true });
        res.json(premiumUsers);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al obtener los usuarios premium.' });
    }
};

exports.updateUser = async (req, res) => {
    try {
        // Separamos password, email y username del resto de los datos
        const { password, email, username, premiumExpiry, banExpiration, ...rest } = req.body;
        let updateData = { ...rest };

        if (email) {
            const emailExists = await User.findOne({ email, _id: { $ne: req.params.id } });
            if (emailExists) {
                return res.status(400).json({ message: "El correo electrónico ya está en uso." });
            }
            updateData.email = email;
        }

        if (username) {
            const usernameExists = await User.findOne({ username, _id: { $ne: req.params.id } });
            if (usernameExists) {
                return res.status(400).json({ message: "El nombre de usuario ya está en uso." });
            }
            updateData.username = username;
        }

        if (password && password.trim() !== "") {
            updateData.password = password;
        }

        // Convertir premiumExpiry y banExpiration a Date, si se envían
        if (premiumExpiry) {
            updateData.premiumExpiry = new Date(premiumExpiry);
        }
        if (banExpiration) {
            updateData.banExpiration = new Date(banExpiration);
        }

        const user = await User.findByIdAndUpdate(req.params.id, updateData, { new: true });
        if (!user) return res.status(404).json({ message: "Usuario no encontrado" });
        res.json({ message: "Usuario actualizado", user });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el usuario." });
    }
};
