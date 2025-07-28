const jwt = require('jsonwebtoken');
const Admin = require('../models/Admin');

const login = async (req, res) => {
  if (!req.body.username || !req.body.password) {
    return res.status(400).json({
      success: false,
      message: "Usuario y contraseña son requeridos"
    });
  }

  try {
    // Buscar el usuario en la base de datos
    const admin = await Admin.findOne({
      where: { username: req.body.username },
      attributes: ['id', 'username', 'password']
    });

    if (!admin) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas"
      });
    }

    // Verificar contraseña
    const isValid = await admin.validPassword(req.body.password);
    if (isValid) {
      return res.status(401).json({
        success: false,
        message: "Credenciales inválidas"
      });
    }

    // Crear token JWT
    const token = jwt.sign(
      {
        id: admin.id,
        username: admin.username
      },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRE}
    );

    // Responder con el token
    res.json({
      success: true,
      token: token,
      admin: {
        id: admin.id,
        username: admin.username
      }
    });

  } catch (error) {
    console.error('Error en login:', error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor"
    });
  }
};

module.exports = { login };