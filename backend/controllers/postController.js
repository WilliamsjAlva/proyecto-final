const Post = require("../models/Post");

exports.createPost = async (req, res) => {
    try {
        const { title, description, anonymous, image, allowPrivateChat } = req.body;
        const author = req.user.id;
        const post = new Post({ title, description, anonymous, image, allowPrivateChat, author });
        await post.save();
        res.status(201).json({ message: "Publicación creada", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al crear la publicación. Inténtalo de nuevo más tarde." });
    }
};

exports.getPosts = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query;
        const posts = await Post.find()
            .populate('author', 'name username')
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        res.json({ posts });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al cargar publicaciones." });
    }
};

exports.getPostById = async (req, res) => {
    try {
        const post = await Post.findById(req.params.id)
            .populate('author', 'name username');
        if (!post) return res.status(404).json({ message: "Publicación no encontrada" });
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
        if (!post) return res.status(404).json({ message: "Publicación no encontrada" });
        if (post.likedBy.includes(userId))
            return res.status(400).json({ message: "Ya has dado like a esta publicación" });
        post.dislikedBy = post.dislikedBy.filter(id => id.toString() !== userId.toString());
        post.likedBy.push(userId);
        post.likes = post.likedBy.length;
        post.dislikes = post.dislikedBy.length;
        await post.save();
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
        if (!post) return res.status(404).json({ message: "Publicación no encontrada" });
        if (post.dislikedBy.includes(userId))
            return res.status(400).json({ message: "Ya has dado dislike a esta publicación" });
        post.likedBy = post.likedBy.filter(id => id.toString() !== userId.toString());
        post.dislikedBy.push(userId);
        post.likes = post.likedBy.length;
        post.dislikes = post.dislikedBy.length;
        await post.save();
        res.json({ message: "Dislike registrado", post });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error al registrar dislike. Inténtalo de nuevo." });
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
