const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");

// Configuración de variables de entorno
dotenv.config();

// Crear la aplicación Express
const app = express();

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Ruta de ejemplo
app.get("/", (req, res) => {
    res.send("¡Servidor funcionando correctamente!");
});

// Conexión a MongoDB
const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        console.log("🚀 Conexión exitosa a MongoDB");
        app.listen(process.env.PORT || 5000, () => {
            console.log(`🚀 Servidor escuchando en el puerto ${process.env.PORT || 5000}`);
        });
    } catch (error) {
        console.error("Error al conectar a MongoDB:", error);
        process.exit(1);
    }
};

startServer();
