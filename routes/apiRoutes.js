const express = require('express');
const router = express.Router();
const carruselController = require('../controllers/carruselController');
const aboutController = require('../controllers/aboutController');
const contactController = require('../controllers/contactController');
const scheduleController = require('../controllers/scheduleController');
const mailController = require('../controllers/mailController')

// Rutas públicas
router.route('/carrusel')
  .post(carruselController.getCarruselItems);
router.get('/about', aboutController.getAboutContent);
router.get('/contacto', contactController.getContactInfo);
router.get('/horarios', scheduleController.getAllSchedules);
router.post('/mail', mailController.sendMail);

module.exports = router;