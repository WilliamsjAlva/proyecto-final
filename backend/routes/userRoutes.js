// backend/routes/userRoutes.js (ejemplo)
const express = require("express");
const authMiddleware = require("../middlewares/authMiddleware");
const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
    // Si el token es válido, req.user estará disponible
    res.json({ message: "Acceso permitido", user: req.user });
});

module.exports = router;
