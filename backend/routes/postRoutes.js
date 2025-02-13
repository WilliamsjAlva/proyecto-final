const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, postController.createPost);
router.get('/', authMiddleware, postController.getPosts);
router.get('/:id', authMiddleware, postController.getPostById);
router.put('/:id', authMiddleware, postController.updatePost);
router.post('/:id/like', authMiddleware, postController.likePost);
router.post('/:id/dislike', authMiddleware, postController.dislikePost);
router.delete("/:id", authMiddleware, postController.deletePost); 
router.post('/:id/report', authMiddleware, postController.reportPost);

module.exports = router;
