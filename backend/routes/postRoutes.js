const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');
const upload = require('../utils/upload'); // Importamos el middleware de multer

// Usamos el middleware de multer (.single("image")) para procesar el archivo de imagen
router.post('/', authMiddleware, upload.single("image"), postController.createPost);

router.get('/', authMiddleware, postController.getPosts);
router.get('/:id', authMiddleware, postController.getPostById);
router.put('/:id', authMiddleware, postController.updatePost);
router.post('/:id/like', authMiddleware, postController.likePost);
router.post('/:id/dislike', authMiddleware, postController.dislikePost);
router.delete("/:id", authMiddleware, postController.deletePost);
router.post('/:id/report', authMiddleware, postController.reportPost);

module.exports = router;
