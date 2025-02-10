const express = require('express');
const router = express.Router();
const commentController = require('../controllers/commentController');
const authMiddleware = require('../middleware/authMiddleware');

router.post('/', authMiddleware, commentController.createComment);
router.get('/:postId', authMiddleware, commentController.getCommentsForPost);
router.post('/:id/like', authMiddleware, commentController.likeComment);
router.post('/:id/dislike', authMiddleware, commentController.dislikeComment);
router.post('/:id/report', authMiddleware, commentController.reportComment);

module.exports = router;