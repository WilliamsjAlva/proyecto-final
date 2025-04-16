const Post = require("../models/Post");
const Notification = require("../models/Notification");

exports.createPost = async (req, res) => {
    try {
        const { title, description, anonymous, allowPrivateChat } = req.body;
        const author = req.user.id;
        // Si se subió una imagen, multer la agrega en req.file
        const image = req.file ? req.file.path : null;
        const post = new Post({ title, description, anonymous, image, allowPrivateChat, author });
        await post.save();
        res.status(201).json({ message: "Publicación creada", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear la publicación. Inténtalo de nuevo más tarde." });
    }
};

exports.updatePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const { title, description } = req.body;

        const post = await Post.findById(postId);
        if (!post)
            return res.status(404).json({ message: "Publicación no encontrada" });

        if (post.author.toString() !== req.user.id.toString()) {
            return res.status(403).json({ message: "No tienes permisos para editar esta publicación" });
        }

        const creationTime = new Date(post.createdAt);
        const oneHourLater = new Date(creationTime.getTime() + 60 * 60 * 1000);
        if (new Date() > oneHourLater) {
            return res.status(400).json({ message: "El tiempo para editar la publicación ha expirado" });
        }

        post.title = title;
        post.description = description;
        post.isEdited = true;
        await post.save();

        res.json({ message: "Publicación actualizada", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al editar la publicación. Inténtalo de nuevo." });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10, search = "" } = req.query;
        let query = {};
        if (search) {
            query = {
                $or: [
                    { title: { $regex: search, $options: "i" } },
                    { description: { $regex: search, $options: "i" } }
                ]
            };
        }
        let posts = await Post.find(query)
            .populate("author", "username _id isBanned")
            .sort({ createdAt: -1 })
            .skip((page - 1) * parseInt(limit))
            .limit(parseInt(limit));

        // Si el usuario no es admin o moderador, ocultar publicaciones cuyos autores estén baneados
        if (req.user.role !== "admin" && req.user.role !== "moderator") {
            posts = posts.filter(post => post.author && !post.author.isBanned);
        }

        res.json({ posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al cargar publicaciones." });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate("author", "_id name username isBanned");
        if (!post)
            return res.status(404).json({ message: "Publicación no encontrada" });
        // Si el autor está baneado y el solicitante no es admin o moderador, se oculta la publicación
        if ((req.user.role !== "admin" && req.user.role !== "moderator") && post.author && post.author.isBanned) {
            return res.status(404).json({ message: "Publicación no encontrada" });
        }
        res.json({ post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al cargar la publicación" });
    }
};

exports.likePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post)
            return res.status(404).json({ message: "Publicación no encontrada" });
        if (post.likedBy.includes(userId))
            return res.status(400).json({ message: "Ya has dado like a esta publicación" });

        // Elimina dislike si existe y agrega like
        post.dislikedBy = post.dislikedBy.filter(id => id.toString() !== userId.toString());
        post.likedBy.push(userId);
        post.likes = post.likedBy.length;
        post.dislikes = post.dislikedBy.length;
        await post.save();

        // Crear notificación de "like" si el actor no es el autor de la publicación
        if (post.author.toString() !== userId) {
            await Notification.create({
                user: post.author,
                type: "like",
                post: postId,
                actor: userId,
            });
        }

        res.json({ message: "Like registrado", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al registrar like. Inténtalo de nuevo." });
    }
};

exports.dislikePost = async (req, res) => {
    try {
        const userId = req.user.id;
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post)
            return res.status(404).json({ message: "Publicación no encontrada" });
        if (post.dislikedBy.includes(userId))
            return res.status(400).json({ message: "Ya has dado dislike a esta publicación" });

        // Elimina like si existe y agrega dislike
        post.likedBy = post.likedBy.filter(id => id.toString() !== userId.toString());
        post.dislikedBy.push(userId);
        post.likes = post.likedBy.length;
        post.dislikes = post.dislikedBy.length;
        await post.save();

        // Crear notificación de "dislike" si el actor no es el autor de la publicación
        if (post.author.toString() !== userId) {
            await Notification.create({
                user: post.author,
                type: "dislike",
                post: postId,
                actor: userId,
            });
        }

        res.json({ message: "Dislike registrado", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al registrar dislike. Inténtalo de nuevo." });
    }
};

exports.deletePost = async (req, res) => {
    try {
        const postId = req.params.id;
        const post = await Post.findById(postId);
        if (!post) return res.status(404).json({ message: "Publicación no encontrada" });

        if (req.user.role !== "admin" && req.user.role !== "moderator") {
            if (post.author.toString() !== req.user.id.toString()) {
                return res.status(403).json({ message: "No tienes permisos para borrar esta publicación" });
            }
        }

        await post.deleteOne();
        res.json({ message: "Publicación borrada exitosamente" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al borrar la publicación. Inténtalo de nuevo." });
    }
};

exports.reportPost = async (req, res) => {
    try {
        const postId = req.params.id;
        res.json({ message: "Publicación reportada. Los moderadores serán notificados." });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al reportar la publicación. Inténtalo de nuevo." });
    }
};
