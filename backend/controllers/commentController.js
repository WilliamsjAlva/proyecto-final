const Comment = require("../models/Comment");
const Post = require("../models/Post");
const Notification = require("../models/Notification");

exports.createComment = async (req, res) => {
    try {
        const { text, postId, parentComment } = req.body;
        const author = req.user.id; 
        const image = req.file ? req.file.path : null;

        const comment = new Comment({
            text,
            image,
            post: postId,
            author,
            parentComment: parentComment || null,
        });

        await comment.save();

        // Crear notificación de "comment" para el autor de la publicación, si no es el mismo usuario
        const post = await Post.findById(postId);
        if (post && post.author.toString() !== author) {
            await Notification.create({
                user: post.author,
                type: "comment",
                post: postId,
                actor: author,
            });
        }

        res.status(201).json({ message: "Comentario creado", comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear el comentario. Inténtalo de nuevo más tarde." });
    }
};

// Obtener comentarios para un post
exports.getCommentsForPost = async (req, res) => {
    try {
        const postId = req.params.postId;

        // Buscar comentarios principales
        const comments = await Comment.find({ post: postId, parentComment: null })
            .populate("author", "username _id")
            .sort({ createdAt: 1 });

        // Buscar las respuestas a cada comentario
        for (let comment of comments) {
            const replies = await Comment.find({ parentComment: comment._id })
                .populate("author", "username _id")
                .sort({ createdAt: 1 });
            comment.replies = replies;
        }

        res.json({ comments });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al cargar comentarios." });
    }
};

// Obtener el número de comentarios de un post
exports.getCommentsCountForPost = async (req, res) => {
    try {
        const postId = req.params.postId;
        const commentsCount = await Comment.countDocuments({ post: postId });
        res.json({ commentsCount });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al contar los comentarios." });
    }
};

// Actualizar (editar) un comentario
exports.updateComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment) {
            return res.status(404).json({ message: "Comentario no encontrado" });
        }

        // Denegar la edición a moderadores
        if (req.user.role === "moderator") {
            return res.status(403).json({ message: "Los moderadores no pueden editar comentarios" });
        }

        // Permitir la edición solo si el usuario es el autor o es admin
        if (comment.author.toString() !== req.user.id.toString() && req.user.role !== "admin") {
            return res.status(403).json({ message: "No tienes permisos para editar este comentario" });
        }

        comment.text = req.body.text;
        comment.isEdited = true;
        await comment.save();
        res.json({ message: "Comentario actualizado", comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al actualizar el comentario. Inténtalo de nuevo." });
    }
};

// Borrar un comentario
exports.deleteComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment)
            return res.status(404).json({ message: "Comentario no encontrado" });

        if (
            req.user.role !== "admin" &&
            req.user.role !== "moderator" &&
            comment.author.toString() !== req.user.id.toString()
        ) {
            return res.status(403).json({ message: "No tienes permisos para borrar este comentario" });
        }

        await comment.deleteOne();
        res.json({ message: "Comentario borrado exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al borrar el comentario. Inténtalo de nuevo." });
    }
};

// Dar like a un comentario
exports.likeComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment)
            return res.status(404).json({ message: "Comentario no encontrado" });

        if (comment.likedBy && comment.likedBy.includes(req.user.id)) {
            return res.status(400).json({ message: "Ya has dado like a este comentario" });
        }
        // Eliminar dislike si existe
        if (comment.dislikedBy) {
            comment.dislikedBy = comment.dislikedBy.filter(
                (id) => id.toString() !== req.user.id.toString()
            );
        }
        comment.likedBy = comment.likedBy || [];
        comment.likedBy.push(req.user.id);
        comment.likes = comment.likedBy.length;
        comment.dislikes = comment.dislikedBy ? comment.dislikedBy.length : 0;
        await comment.save();

        // Crear notificación para el autor del comentario si el usuario que da like no es él
        if (comment.author.toString() !== req.user.id) {
            await Notification.create({
                user: comment.author,
                type: "like",
                post: comment.post,
                comment: comment._id, // Se añade la referencia al comentario
                actor: req.user.id,
            });
        }

        res.json({ message: "Like registrado en el comentario", comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al dar like al comentario. Inténtalo de nuevo." });
    }
};

// Dar dislike a un comentario
exports.dislikeComment = async (req, res) => {
    try {
        const comment = await Comment.findById(req.params.id);
        if (!comment)
            return res.status(404).json({ message: "Comentario no encontrado" });

        if (comment.dislikedBy && comment.dislikedBy.includes(req.user.id)) {
            return res.status(400).json({ message: "Ya has dado dislike a este comentario" });
        }
        if (comment.likedBy) {
            comment.likedBy = comment.likedBy.filter(
                (id) => id.toString() !== req.user.id.toString()
            );
        }
        comment.dislikedBy = comment.dislikedBy || [];
        comment.dislikedBy.push(req.user.id);
        comment.likes = comment.likedBy ? comment.likedBy.length : 0;
        comment.dislikes = comment.dislikedBy.length;
        await comment.save();

        if (comment.author.toString() !== req.user.id) {
            await Notification.create({
                user: comment.author,
                type: "dislike",
                post: comment.post,
                comment: comment._id, 
                actor: req.user.id,
            });
        }

        res.json({ message: "Dislike registrado en el comentario", comment });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al dar dislike al comentario. Inténtalo de nuevo." });
    }
};

// Reportar un comentario
exports.reportComment = async (req, res) => {
    try {
        res.json({ message: "Comentario reportado. Los moderadores serán notificados." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al reportar el comentario. Inténtalo de nuevo." });
    }
};
