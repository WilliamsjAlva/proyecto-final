const express = require("express");
const router = express.Router();
const commentController = require("../controllers/commentController");
const authMiddleware = require("../middleware/authMiddleware");
const upload = require("../utils/upload"); // Asegúrate de que esta ruta sea correcta

// Rutas para comentarios
// Agregamos upload.single("image") para procesar la imagen enviada
router.post("/", authMiddleware, upload.single("image"), commentController.createComment);
router.get("/:postId", authMiddleware, commentController.getCommentsForPost);
router.put("/:id", authMiddleware, commentController.updateComment);
router.delete("/:id", authMiddleware, commentController.deleteComment);

// Ruta para obtener el número de comentarios de un post
router.get("/count/:postId", commentController.getCommentsCountForPost);

// Rutas para like, dislike y reportar comentarios
router.post("/:id/like", authMiddleware, commentController.likeComment);
router.post("/:id/dislike", authMiddleware, commentController.dislikeComment);
router.post("/:id/report", authMiddleware, commentController.reportComment);

module.exports = router;
