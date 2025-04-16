// backend/routes/paymentRoutes.js
const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");
const upload = require("../utils/upload"); // Importa la configuración de Multer

// Endpoint para subir la imagen del comprobante
router.post("/upload", upload.single("screenshot"), (req, res) => {
    if (!req.file) {
        return res.status(400).json({ message: "No se ha subido ningún archivo." });
    }
    // Devuelve la ruta del archivo subido, que se usará como screenshotUrl
    res.json({ screenshotUrl: req.file.path });
});

// Rutas para solicitudes de pago
router.post("/request", paymentController.createPaymentRequest);
router.get("/:id", paymentController.getPaymentDetail);
router.get("/", paymentController.listPayments);
router.patch("/:id/status", paymentController.updatePaymentStatus);

module.exports = router;
