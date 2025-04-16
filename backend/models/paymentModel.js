const mongoose = require("mongoose");

const paymentRequestSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    plan: {
        label: { type: String, required: true }, // Ej. "1 Mes", "3 Meses", etc.
        days: { type: Number, required: true },
        amount: { type: Number, required: true }  // Monto en centavos o en la unidad que decidas
    },
    screenshotUrl: { type: String, required: true }, // URL del comprobante (p.ej. en Cloudinary o S3)
    status: {
        type: String,
        enum: ["pending", "verified", "rejected"],
        default: "pending",
    },
    adminComment: { type: String, default: "" },
    createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model("PaymentRequest", paymentRequestSchema);
