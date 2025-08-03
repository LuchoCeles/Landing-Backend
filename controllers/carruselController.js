const CarruselItem = require('../models/CarruselItem');
const path = require('path');
const multer = require('multer');

// Configuración de Multer
const multerConfig = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const filetypes = /jpeg|jpg|png/;
    const mimetype = filetypes.test(file.mimetype);
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());

    if (mimetype && extname) {
      return cb(null, true);
    }
    cb(new Error('Solo se permiten imágenes (JPEG, JPG, PNG)'));
  }
});

// Middleware para subir una sola imagen
const upload = multerConfig.single('imageFile');
const uploadPatch = multerConfig.single('image');

// Función para procesar imagen (para el update)
const processImage = async (req) => {
  if (!req.file) return;

  return {
    base64: req.file.buffer.toString('base64'),
    mimeType: req.file.mimetype
  };
};

// Controlador para agregar ítem
const addCarruselItem = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'Debe subir una imagen' });
    }

    const { title, description } = req.body;
    const base64Image = req.file.buffer.toString('base64');

    const lastItem = await CarruselItem.findOne({
      order: [['order', 'DESC']]
    });

    const newOrder = lastItem ? lastItem.order + 1 : 1;

    const newItem = await CarruselItem.create({
      title,
      description,
      image: `data:${req.file.mimetype};base64,${base64Image}`,
      order: newOrder
    });

    res.status(201).json({
      ...newItem.toJSON(),
      image: `data:${req.file.mimetype};base64,${base64Image}`
    });
  } catch (error) {
    console.error('Error al agregar ítem:', error);
    res.status(500).json({ message: 'Error al agregar imagen al carrusel' });
  }
};

// Controlador para obtener ítems con imágenes optimizadas
const getCarruselItems = async (req, res) => {
  try {
    const items = await CarruselItem.findAll({
      order: [['order', 'ASC']],
      attributes: ['id', 'title', 'description', 'order', 'image']
    });

    res.json({
      success: true,
      data: items,
      count: items.length
    });
  } catch (error) {
    console.error('Error al obtener items del carrusel:', error);
    res.status(500).json({
      success: false,
      message: 'Error al obtener el carrusel',
      error: process.env.NODE_ENV === 'development' ? error.message : undefined
    });
  }
};

// Controlador para actualizar ítem
const updateCarruselItem = async (req, res) => {
  try {
    const { id, title, description } = req.body;

    const item = await CarruselItem.findByPk(id);
    if (!item) {
      return res.status(404).json({ message: 'Item no encontrado' });
    }

    if (description !== undefined) item.description = description;
    if (title !== undefined) item.title = title;

    if (req.file) {
      const imageData = await processImage(req);
      if (imageData) {
        item.image = `data:${imageData.imageType};base64,${imageData.image}`;
      }
    }

    await item.save();
    res.json({
      ...item.toJSON(),
      message: 'Modificado Correctamente'
    });
  } catch (error) {
    console.error('Error actualizando item:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
};

// Controlador para cambiar el orden de los ítems le llega un array con los ids y los nuevos órdenes
const changeOrder = async (req, res) => {
  try {
    const items = req.body;

    if (!Array.isArray(items)) {
      return res.status(400).json({ message: 'Formato de orden incorrecto' });
    }

    await Promise.all(items.map(item =>
      CarruselItem.update(
        { order: item.order },
        { where: { id: item.id } }
      )
    ));

    res.json({ message: 'Orden actualizado correctamente' });
  } catch (error) {
    console.error('Error al cambiar el orden:', error);
    res.status(500).json({ message: 'Error del servidor' });
  }
}

// Controlador para eliminar ítem
const deleteCarruselItem = async (req, res) => {
  try {
    const item = await CarruselItem.findByPk(req.params.id);
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

// Middleware para manejar la subida en updates
const updateUpload = (req, res, next) => {
  upload(req, res, (err) => {
    if (err) {
      if (err.code === 'LIMIT_FILE_SIZE') {
        return res.status(400).json({ message: 'La imagen no debe exceder los 5MB' });
      }
      return res.status(400).json({ message: err.message });
    }
    next();
  });
};

module.exports = {
  upload,
  uploadPatch,
  updateUpload,
  getCarruselItems,
  addCarruselItem,
  updateCarruselItem,
  deleteCarruselItem,
  changeOrder
};