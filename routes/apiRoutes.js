const express = require('express');
const router = express.Router();
const carruselController = require('../controllers/carruselController');
const aboutController = require('../controllers/aboutController');
const contactController = require('../controllers/contactController');
const scheduleController = require('../controllers/scheduleController');
const imageProxy = require('../utils/imageProxy');

// Rutas públicas
router.get('/carrusel', carruselController.getCarruselItems);
router.get('/about', aboutController.getAboutContent);
router.get('/contacto', contactController.getContactInfo);
router.get('/horarios', scheduleController.getAllSchedules);
router.get('/image/carrusel/:id', imageProxy);

module.exports = router;