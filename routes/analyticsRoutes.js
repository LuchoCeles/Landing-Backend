const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const analyticsController = require('../controllers/analyticsController');

// Todas las rutas requieren autenticación
router.use(authMiddleware);

// Ruta para obtener la URL de autenticación
router.get('/auth', analyticsController.getAuthUrl);

// Ruta para manejar el callback de autenticación
router.get('/auth/callback', analyticsController.handleAuthCallback);

// Ruta para obtener los datos de Analytics
router.get('/data', analyticsController.getAnalyticsData);

module.exports = router;