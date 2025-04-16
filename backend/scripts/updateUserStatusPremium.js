const cron = require('node-cron');
const User = require('../models/User');

// Programa la tarea para que se ejecute cada minuto
cron.schedule('* * * * *', async () => {
    try {
        const now = new Date();
        // Actualiza usuarios premium cuyo premiumExpiry ya pasó
        const premiumResult = await User.updateMany(
            {
                isPremium: true,
                premiumExpiry: { $ne: null, $lte: now }
            },
            {
                isPremium: false,
                premiumExpiry: null
            }
        );

        // Actualiza usuarios baneados cuyo banExpiration ya pasó
        const bannedResult = await User.updateMany(
            {
                isBanned: true,
                banExpiration: { $ne: null, $lte: now }
            },
            {
                isBanned: false,
                banExpiration: null,
                banReason: ""
            }
        );

        console.log(`[${now.toISOString()}] Cron job ejecutado: actualizados premium: ${premiumResult.modifiedCount}, baneados: ${bannedResult.modifiedCount}`);
    } catch (error) {
        console.error('Error ejecutando el cron job:', error);
    }
});
