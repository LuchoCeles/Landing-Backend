const Schedule = require('../models/Schedule');
const Store = require('../models/Store');

const getAllSchedules = async (req, res) => {
  try {
    const schedules = await Schedule.findAll({
      attributes:['id', 'dia', 'horario'],
      include: [{
        model: Store,
        as: 'sucursal',
        attributes: ['id', 'nombre']
      }],
      order: [
        ['store_id', 'ASC'],
        ['dia', 'ASC'],
        ['horario', 'ASC']
      ]
    });

    res.json(schedules);
  } catch (error) {
    console.error('Error al obtener los horarios:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const addSchedule = async (req, res) => {
  const { store_id, dia, horario } = req.body;

  try {
    if (!store_id || !dia || !horario) {
      return res.status(400).json({ message: 'Faltan campos requeridos' });
    }

    const store = await Store.findByPk(store_id);
    if (!store) {
      return res.status(404).json({ message: 'Sucursal no encontrada' });
    }

    const newSchedule = await Schedule.create({
      store_id,
      dia,
      horario
    });

    res.status(201).json({
      message: 'Horario creado correctamente',
      schedule: newSchedule
    });

  } catch (error) {
    console.error('Error al crear horario:', error);
    res.status(500).json({
      message: 'Error del servidor',
      error: error.message
    });
  }
};

const updateSchedules = async (req, res) => {
  const { id, dia, horario } = req.body;

  try {
    const schedule = await Schedule.findByPk(id);

    if (!schedule) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }

    if (dia !== undefined) schedule.dia = dia;
    if (horario !== undefined) schedule.horario = horario;

    await schedule.save();

    res.json({
      message: 'Horario actualizado correctamente',
      schedule
    });

  } catch (error) {
    console.error('Error al actualizar horario:', error);
    res.status(500).json({
      message: 'Error del servidor',
      error: error.message
    });
  }
};

const deleteSchedules = async (req, res) => {
  const { id } = req.params;

  try {
    const schedule = await Schedule.findByPk(id);

    if (!schedule) {
      return res.status(404).json({ message: 'Horario no encontrado' });
    }

    await schedule.destroy();

    res.json({ message: 'Horario eliminado correctamente' });

  } catch (error) {
    console.error('Error al eliminar horario:', error);
    res.status(500).json({
      message: 'Error del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getAllSchedules,
  updateSchedules,
  addSchedule,
  deleteSchedules
};