const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationController");
const authMiddleware = require("../middleware/authMiddleware");

router.get("/", authMiddleware, notificationController.getNotifications);
router.put("/mark-as-read/:id", authMiddleware, notificationController.markAsRead);
router.put("/mark-all-as-read", authMiddleware, notificationController.markAllAsRead);

module.exports = router;
