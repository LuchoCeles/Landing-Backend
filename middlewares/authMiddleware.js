const jwt = require('jsonwebtoken');

const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;
  
  if (!authHeader || !authHeader.startsWith('Bearer')) {
    return res.status(401).json({ 
      success: false,
      message: 'Autenticación requerida. Por favor provea un token.' 
    });
  }

  const token = authHeader.split(' ')[1];

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    req.admin = {
      id: decoded.id,
      username: decoded.username
    };
    
    next();
  } catch (error) {
    console.error('Error en autenticación:', error);
    
    if (error.name === 'TokenExpiredError') {
      return res.status(401).json({ 
        success: false,
        message: 'Token expirado. Por favor inicie sesión nuevamente.' 
      });
    }
    
    res.status(401).json({ 
      success: false,
      message: 'Token inválido. Autenticación fallida.' 
    });
  }
};

module.exports = authMiddleware;