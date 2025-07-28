const Schedule = require('../models/Schedule');

const getAllSchedules = async (req, res) => {
  try {
    // Obtener todos los horarios ordenados
    const schedules = await Schedule.findAll({
      order: [
        ['sucursal', 'ASC'],
        ['dia', 'ASC']
      ],
      raw: true
    });

    // Agrupar por sucursal
    const i = 0;
    const groupedBySucursal = schedules.reduce((acc, schedule) => {
      const { sucursal, dia, hora_inicio, hora_fin } = schedule;
      
      if (!acc[sucursal]) {
        acc[sucursal] = [];
      }
      
      acc[sucursal].push({
        dia,
        horario: `${hora_inicio} - ${hora_fin}`
      });
      
      return acc;
    }, {});

    // Convertir a formato de array como solicitaste
    const result = Object.entries(groupedBySucursal).map(([sucursal, horarios]) => {
      return {
        [sucursal]: horarios
      };
    });

    res.json(result);
  } catch (error) {
    console.error('Error fetching grouped schedules:', error);
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