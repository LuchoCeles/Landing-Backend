const CarruselItem = require('../models/CarruselItem');

const getCarruselItems = async (req, res) => {
  try {
    const items = await CarruselItem.findAll({
      order: [['order', 'ASC']]
    });
    res.json(items);
  } catch (error) {
    res.status(500).json({ message: 'Error al obtener el carrusel' });
  }
};

const addCarruselItem = async (req, res) => {
  try {
    const { image_url, text } = req.body;
    const newItem = await CarruselItem.create({ image_url, text });
    res.status(201).json(newItem);
  } catch (error) {
    res.status(500).json({ message: 'Error al agregar imagen al carrusel' });
  }
};

const updateCarruselItem = async (req, res) => {
  const { id } = req.params;
  const { text, order } = req.body;

  try {
    const item = await CarruselItem.findByPk(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    if (text !== undefined) item.text = text;
    if (order !== undefined) item.order = order;

    await item.save();
    res.json(item);
  } catch (error) {
    console.error('Error actualizando item:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

const deleteCarruselItem = async (req, res) => {
  const { id } = req.params;

  try {
    const item = await CarruselItem.findByPk(id);
    
    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    await item.destroy();
    res.json({ message: 'Item eliminado correctamente' });
  } catch (error) {
    console.error('Error eliminando item:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

module.exports = {
  getCarruselItems,
  addCarruselItem,
  updateCarruselItem,
  deleteCarruselItem
};