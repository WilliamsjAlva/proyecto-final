// backend/middlewares/authMiddleware.js
const jwt = require("jsonwebtoken");

const authMiddleware = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) {
        return res.status(401).json({ message: "No se proporcionó token de autenticación" });
    }

    // El token se espera en el formato "Bearer <token>"
    const token = authHeader.split(" ")[1];
    if (!token) {
        return res.status(401).json({ message: "Token mal formado" });
    }

    try {
        // Verifica el token usando JWT_SECRET definido en tu .env
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        // Asigna los datos decodificados al request para usarlos en la ruta protegida
        req.user = decoded;
        next();
    } catch (error) {
        return res.status(401).json({ message: "Token inválido o expirado" });
    }
};

module.exports = authMiddleware;
