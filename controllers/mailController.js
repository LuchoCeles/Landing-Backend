const nodemailer = require('nodemailer');
const rateLimit = require('express-rate-limit');
require('dotenv').config();

// Configuración
const emailLimiter = rateLimit({
  windowMs: 5 * 60 * 1000, // 5 minutos de ventana
  max: 1, // Máximo 1 solicitud por ventana
  keyGenerator: (req) => {
    // Método seguro para obtener IP que funciona con IPv4/IPv6 y detrás de proxies
    const getClientIp = (req) => {
      const forwarded = req.headers['x-forwarded-for'];
      if (forwarded) {
        const ips = forwarded.split(',');
        return ips[0].trim();
      }
      return req.socket.remoteAddress;
    };
    
    const ip = getClientIp(req);
    const email = req.body.email || 'unknown'; // Fallback por si no hay email
    
    // Normalizamos IPv6 para evitar bypass
    const normalizedIp = ip.includes('::') ? ip.split(':').slice(0, 4).join(':') : ip;
    
    return `${normalizedIp}-${email}`;
  },
  handler: (req, res) => {
    return res.status(429).json({
      message: 'Por favor espere 5 minutos entre mensajes',
      cooldown: '5 minutos'
    });
  },
  skip: (req) => {
    // Opcional: Permitir solicitudes en desarrollo sin limitación
    return process.env.NODE_ENV === 'development';
  },
  legacyHeaders: false, // Desactiva headers obsoletos
  standardHeaders: true // Usa headers estándar RFC 6585
});

const sendMail = async (req, res) => {
  const { name, email, phone, company, message } = req.body;

  // Validación mejorada
  if (!name?.trim() || !email?.trim() || !message?.trim()) {
    return res.status(400).json({
      message: 'Nombre, email y mensaje son obligatorios',
      fields: {
        name: !name?.trim() ? 'Campo requerido' : null,
        email: !email?.trim() ? 'Campo requerido' : null,
        message: !message?.trim() ? 'Campo requerido' : null
      }
    });
  }

  // Validación de formato de email mejorada
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
  if (!emailRegex.test(email)) {
    return res.status(400).json({
      message: 'Por favor ingrese un email válido',
      fields: {
        email: 'Formato de email inválido'
      }
    });
  }

  // Validación estricta de teléfono
  if (phone && !/^\+?[\d\s-]{6,20}$/.test(phone)) {
    return res.status(400).json({
      message: 'El teléfono solo puede contener números, espacios, guiones y opcionalmente un + al inicio',
      fields: {
        phone: 'Formato de teléfono inválido'
      }
    });
  }

  // Configuración segura del transporter
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    host: 'smtp.gmail.com',
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  // Opciones del correo con sanitización básica
  const sanitize = (str) => str.replace(/</g, '&lt;').replace(/>/g, '&gt;');
  const mailOptions = {
    from: `"${sanitize(name)}" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_USER,
    replyTo: sanitize(email),
    subject: `Nuevo mensaje de ${sanitize(name)}${company ? ` (${sanitize(company)})` : ''}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">Nuevo mensaje de contacto</h2>
        <p><strong>Nombre:</strong> ${sanitize(name)}</p>
        ${company ? `<p><strong>Empresa:</strong> ${sanitize(company)}</p>` : ''}
        <p><strong>Email:</strong> ${sanitize(email)}</p>
        ${phone ? `<p><strong>Teléfono:</strong> ${sanitize(phone)}</p>` : ''}
        <p><strong>Mensaje:</strong></p>
        <div style="background: #f5f5f5; padding: 15px; border-radius: 5px;">
          ${sanitize(message).replace(/\n/g, '<br>')}
        </div>
      </div>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.json({ 
      success: true, 
      message: 'Mensaje enviado correctamente' 
    });
  } catch (error) {
    console.error('Error al enviar:', error);
    res.status(500).json({
      message: 'Error al enviar el mensaje',
      ...(process.env.NODE_ENV === 'development' && {
        details: error.message,
        stack: error.stack
      })
    });
  }
};

module.exports = { sendMail, emailLimiter };