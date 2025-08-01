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
  .patch(carruselController.changeOrder)
  .post(carruselController.upload, carruselController.addCarruselItem);

router.route('/carrusel/:id')
  .patch(carruselController.updateCarruselItem)
  .delete(carruselController.deleteCarruselItem);

router.patch('/about', aboutController.updateAboutContent);
router.patch('/contacto', contactController.updateContactInfo);
router.patch('/horarios', scheduleController.updateSchedules);

module.exports = router;