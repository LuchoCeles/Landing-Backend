const nodemailer = require('nodemailer');
require('dotenv').config();

const sendMail = async (req, res) => {
  const { name, email, phone, company, message } = req.body;

  if (!name || !email || !message) {
    return res.status(400).json({ error: 'Nombre, email y mensaje son obligatorios' });
  }

  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: process.env.EMAIL_USER,  // Tu correo (ej: contacto@tuempresa.com)
      pass: process.env.EMAIL_PASS   // Contraseña de aplicación
    }
  });

  // 2. Opciones del correo
  const mailOptions = {
    from: `"Formulario de Contacto" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    subject: `Nuevo mensaje de ${name}${company ? ` (${company})` : ''}`,
    html: `
      <h2>Nueva consulta</h2>
      <p><strong>Nombre:</strong> ${name}</p>
      ${company ? `<p><strong>Empresa:</strong> ${company}</p>` : ''}
      <p><strong>Email:</strong> ${email}</p>
      ${phone ? `<p><strong>Teléfono:</strong> ${phone}</p>` : ''}
      <p><strong>Mensaje:</strong></p>
      <p>${message.replace(/\n/g, '<br>')}</p>
      <hr>
      <p>Enviado el: ${new Date().toLocaleString()}</p>
    `
  };

  // 3. Enviar correo
  try {
    await transporter.sendMail(mailOptions);
    res.json({ success: true });
  } catch (error) {
    console.error('Error al enviar:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
}

module.exports = {
  sendMail
};
