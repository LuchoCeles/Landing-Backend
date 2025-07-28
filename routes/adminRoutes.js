const express = require('express');
const router = express.Router();
const authMiddleware = require('../middlewares/authMiddleware');
const adminController = require('../controllers/adminController');
const carruselController = require('../controllers/carruselController');
const aboutController = require('../controllers/aboutController');
const contactController = require('../controllers/contactController');
const scheduleController = require('../controllers/scheduleController');

// Login (pública)
router.post('/login', adminController.login);

// Rutas protegidas
router.use(authMiddleware);

router.route('/carrusel')
  .get(carruselController.getCarruselItems)
  .post(carruselController.addCarruselItem);

router.route('/carrusel/:id')
  .put(carruselController.updateCarruselItem)
  .delete(carruselController.deleteCarruselItem);

router.put('/about', aboutController.updateAboutContent);
router.put('/contacto', contactController.updateContactInfo);
router.put('/horarios', scheduleController.updateSchedules);

module.exports = router;