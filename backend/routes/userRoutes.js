// backend/routes/userRoutes.js
const express = require("express");
const authMiddleware = require("../middleware/authMiddleware");
const userController = require("../controllers/userController");
const router = express.Router();

router.get("/profile", authMiddleware, (req, res) => {
    res.json({ message: "Acceso permitido", user: req.user });
});

// Colocamos la ruta estática /premium antes de las rutas dinámicas
router.get("/premium", authMiddleware, userController.getPremiumUsers);

router.get("/", authMiddleware, userController.getUsers);
router.get("/:id", authMiddleware, userController.getUserById);
router.put("/:id", authMiddleware, userController.updateUser);

module.exports = router;
