const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async (req, res) => {
  const { name, email, phone, company, message } = req.body;

  // Validación básica
  if (!name || !email || !message) {
    return res.status(400).json({
      error: 'Nombre, email y mensaje son obligatorios',
      fields: {
        name: !name ? 'Campo requerido' : null,
        email: !email ? 'Campo requerido' : null,
        message: !message ? 'Campo requerido' : null
      }
    });
  }

  // Configuración directa con usuario y contraseña
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false, // true para 465, false para otros puertos
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Opciones del correo
  const mailOptions = {
    from: `"${name}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER, // O el email que debe recibir los mensajes
    replyTo: email,
    subject: `Nuevo mensaje de ${name}${company ? ` (${company})` : ''}`,
    html: `
      <div style="font-family: Arial, sans-serif;">
        <h2>Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${name}</p>
        ${company ? `<p><strong>Empresa:</strong> ${company}</p>` : ''}
        <p><strong>Email:</strong> ${email}</p>
        ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
        <p><strong>Mensaje:</strong></p>
        <p>${message.replace(/\n/g, '<br>')}</p>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true, message: 'Mensaje enviado correctamente' });
  } catch (error) {
    console.error('Error al enviar:', error);
    res.status(500).json({
      error: 'Error al enviar el mensaje',
      details: process.env.NODE_ENV === 'development' ? error.message : null
    });
  }
};

module.exports = { sendMail };