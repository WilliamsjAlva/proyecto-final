const express = require('express');
const router = express.Router();
const postController = require('../controllers/postController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, postController.createPost);
router.get('/', authMiddleware, postController.getPosts);
router.get('/:id', authMiddleware, postController.getPostById);
router.post('/:id/like', authMiddleware, postController.likePost);
router.post('/:id/dislike', authMiddleware, postController.dislikePost);
router.post('/:id/report', authMiddleware, postController.reportPost);

module.exports = router;
