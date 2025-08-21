const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');
const authenticateAdmin = require('../middlewares/authMiddleware');

// Aplicar middleware de autenticación a todas las rutas
router.use(authenticateAdmin);

// Ruta para obtener URL de autenticación
router.get('/auth-url', analyticsController.getAuthUrl);

// Ruta para manejar callback de autenticación
router.get('/callback', analyticsController.handleAuthCallback);

// Ruta para obtener datos de analytics
router.get('/data', analyticsController.getAnalyticsData);

// Ruta para desconectar Google Analytics
router.delete('/disconnect', analyticsController.disconnectAnalytics);

module.exports = router;