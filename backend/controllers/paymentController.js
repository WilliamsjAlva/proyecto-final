const PaymentRequest = require("../models/paymentRequest");
const User = require("../models/User");
const mongoose = require("mongoose");

exports.createPaymentRequest = async (req, res) => {
    try {
        const { user, plan, screenshotUrl } = req.body;

        if (!mongoose.Types.ObjectId.isValid(user)) {
            return res.status(400).json({ message: "ID de usuario inválido." });
        }

        const paymentRequest = new PaymentRequest({
            user: new mongoose.Types.ObjectId(user),
            plan,
            screenshotUrl: `${process.env.SERVER_URL}/${screenshotUrl}`, // Asegurar URL accesible
            status: "pending",
        });

        await paymentRequest.save();
        res.status(201).json({ message: "Solicitud de pago creada exitosamente." });
    } catch (error) {
        console.error("Error creando solicitud de pago:", error);
        res.status(500).json({ message: "Error interno del servidor." });
    }
};

exports.getPaymentDetail = async (req, res) => {
    try {
        const payment = await PaymentRequest.findById(req.params.id).populate("user");
        if (!payment) return res.status(404).json({ message: "Pago no encontrado." });
        res.json(payment);
    } catch (error) {
        console.error("Error obteniendo detalle del pago:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};

exports.listPayments = async (req, res) => {
    try {
        const { status, page = 1, limit = 10, search = '' } = req.query;
        const query = {};
        if (status) {
            query.status = status;
        }
        if (search) {
            query['plan.label'] = { $regex: search, $options: "i" };
        }
        const payments = await PaymentRequest.find(query)
            .populate("user")
            .sort({ createdAt: -1 })
            .skip((page - 1) * limit)
            .limit(Number(limit));
        const total = await PaymentRequest.countDocuments(query);
        res.json({ payments, total, page: Number(page), pages: Math.ceil(total / limit) });
    } catch (error) {
        console.error("Error listando pagos:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};

exports.updatePaymentStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status, adminComment } = req.body;
        if (!['pending', 'verified', 'rejected'].includes(status)) {
            return res.status(400).json({ message: "Estado inválido." });
        }
        const payment = await PaymentRequest.findById(id);
        if (!payment) return res.status(404).json({ message: "Pago no encontrado." });
        payment.status = status;
        if (adminComment) payment.adminComment = adminComment;
        await payment.save();
        res.json(payment);
    } catch (error) {
        console.error("Error actualizando el estado del pago:", error);
        res.status(500).json({ message: "Error en el servidor." });
    }
};
