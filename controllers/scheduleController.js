const Schedule = require('../models/Schedule');

const getAllSchedules = async (req, res) => {
  try {
    // Obtener todos los horarios ordenados
    const schedules = await Schedule.findAll({
      order: [
        ['id', 'ASC'],
        ['sucursal', 'ASC'],
        ['dia', 'ASC'],
        ['horario', 'ASC']
      ],
      raw: true
    });

    res.json(schedules);
  } catch (error) {
    console.error('Error al obtener los horarios:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const addSchedule = async (req, res) => {
  const { sucursal, dia, horario } = req.body;
  try {
    if (sucursal === undefined || dia === undefined || horario === undefined) {
      return res.status(400).json({ message: 'Datos incompletos' });
    }

    await Schedule.create({ sucursal, dia, horario });
    return res.status(201).json({ message: 'Horario creado correctamente' });

  } catch (error) {
    console.error('Error al cargar la sucursal:', error);
    return res.status(500).json({ message: 'Server error' });
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
    console.error('Error al actualizar los horarios:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const deleteSchedules = async (req, res) => {
  try {
    if (!req.params.id) {
      return res.status(400).json({ message: 'Se esperaba un array de horarios' });
    }

    if (req.params.id) {
      await Schedule.destroy({ where: { id: req.params.id } });
    }
    return res.status(200).json({ message: 'Horarios eliminados correctamente' });

  } catch (error) {
    console.error('Error al eliminar horarios:', error);
    return res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  getAllSchedules,
  updateSchedules,
  addSchedule,
  deleteSchedules
};