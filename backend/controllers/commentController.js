const Comment = require('../models/Comment');

exports.createComment = async (req, res) => {
    try {
        const { text, postId, parentComment } = req.body;
        const author = req.user.id;
        const comment = new Comment({ text, post: postId, parentComment: parentComment || null, author });
        await comment.save();
        res.status(201).json({ message: 'Comentario creado', comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al crear comentario. Inténtalo de nuevo más tarde.' });
    }
};

exports.getCommentsForPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const comments = await Comment.find({ post: postId })
            .populate('author', 'name username')
            .sort({ createdAt: 1 });
        res.json({ comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al cargar comentarios.' });
    }
};

exports.likeComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findOneAndUpdate({ id: commentId }, { $inc: { likes: 1 } }, { new: true });
        res.json({ message: 'Like registrado en el comentario', comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar like en el comentario. Inténtalo de nuevo.' });
    }
};

exports.dislikeComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        const comment = await Comment.findOneAndUpdate({ id: commentId }, { $inc: { dislikes: 1 } }, { new: true });
        res.json({ message: 'Dislike registrado en el comentario', comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al registrar dislike en el comentario. Inténtalo de nuevo.' });
    }
};

exports.reportComment = async (req, res) => {
    try {
        const commentId = req.params.id;
        res.json({ message: 'Comentario reportado. Los moderadores serán notificados.' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al reportar el comentario. Inténtalo de nuevo.' });
    }
};
