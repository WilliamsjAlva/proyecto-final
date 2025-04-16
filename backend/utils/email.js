const nodemailer = require("nodemailer");

const sendWelcomeEmail = async (to, name) => {
    try {
        const transporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_USER,
                pass: process.env.EMAIL_PASS,
            },
        });

        const mailOptions = {
            from: `"SOLVEX" <${process.env.EMAIL_USER}>`,
            to,
            subject: "Reporta, conecta, soluciona. ¡Bienvenido a SOLVEX!",
            html: `
<!DOCTYPE html>
<html>

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bienvenido a SOLVEX</title>
</head>

<body style="font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0;">
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" border="0" bgcolor="#f4f4f4">
        <tr>
            <td align="center" style="padding: 20px 0;">
                <table role="presentation" width="600px" cellspacing="0" cellpadding="0" border="0" bgcolor="#ffffff"
                    style="border-radius: 10px; box-shadow: 0px 4px 10px rgba(0, 0, 0, 0.1);">
                    <tr>

                    </tr>
                    <tr>
                        <td align="center" style="padding: 20px;">
                            <a style="
                            background-color: #0057FF;
                            color: #ffffff;
                            font-weight: bold;
                            font-size: 20px;
                            border-radius: 30px;
                            padding: 10px 25px;
                            text-decoration: none;
                            font-family: Arial, sans-serif;
                            display: inline-block;
                            margin-top: 10px;
                        ">SOLVEX
                            </a>
                            <h2 style="color: #333;">¡Hola, ${name}!</h2>
                            <p style="color: #666; font-size: 16px; line-height: 1.5;">
                                Gracias por registrarte en <strong>SOLVEX</strong>. Ahora puedes reportar fallas,
                                obtener ayuda y contribuir con la comunidad.
                                <br><br>
                                Empieza creando tu primer ticket o explora los reportes de otros usuarios.
                            </p>
                            <!-- Botón con estilo SolveX -->
                            <a style="
                            border: solid 1px #0057E5;
                            color: #0057E5;
                            font-weight: bold;
                            font-size: 16px;
                            border-radius: 30px;
                            padding: 10px 25px;
                            text-decoration: none;
                            font-family: Arial, sans-serif;
                            display: inline-block;
                            margin-top: 10px;
                            cursor: pointer;
                        ">
                                Ir a SOLVEX
                            </a>
                        </td>
                    </tr>
                    <tr>
                        <td align="center"
                            style="padding: 20px; background-color: #007bff; color: #ffffff; font-size: 14px; border-radius: 0 0 10px 10px;">
                            Si necesitas ayuda, escríbenos a
                            <a href="mailto:soporte@solvex.com"
                                style="color: #fff; text-decoration: underline;">soporte@solvex.com</a>
                        </td>
                    </tr>
                </table>
            </td>
        </tr>
    </table>
</body>

</html>
            `,
        };

        await transporter.sendMail(mailOptions);
        console.log("Correo de bienvenida enviado a:", to);
    } catch (error) {
        console.error("Error al enviar correo de bienvenida:", error);
    }
};

module.exports = { sendWelcomeEmail };
