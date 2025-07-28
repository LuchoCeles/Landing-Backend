const Schedule = require('../models/Schedule');

const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.findAll({
      order: [
        ['sucursal', 'ASC'],
        ['dia', 'ASC']
      ]
    });
    res.json(schedules);
  } catch (error) {
    console.error('Error fetching schedules:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateSchedules = async (req, res) => {
  const { schedules } = req.body;

  try {
    // Eliminar todos los horarios existentes
    await Schedule.destroy({ where: {} });

    // Crear los nuevos horarios
    const newSchedules = await Schedule.bulkCreate(schedules);

    res.json(newSchedules);
  } catch (error) {
    console.error('Error updating schedules:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAllSchedules,
  updateSchedules
};