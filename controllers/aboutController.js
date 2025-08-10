const About = require('../models/About');

const getAboutContent = async (req, res) => {
  try {
    const about = await About.findOne({ attributes: ['id', 'content'] });
    res.json(about);
  } catch (error) {
    console.error('Error fetching about content:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAboutContent = async (req, res) => {
  const { id, content } = req.body;
  const updated_at = new Date();
  try {
    const about = await About.findByPk(id, {
      attributes: ['id', 'content']
    });

    if (!about) {
      return res.status(404).json({
        success: false,
        message: 'Registro no encontrado'
      });
    }

    about.content = content;
    about.updated_at = updated_at;
    await about.save();

    res.json({
      success: true,
      message: 'Contenido actualizado correctamente'
    });

  } catch (error) {
    console.error('Error al actualizar contenido:', error);
    res.status(500).json({
      success: false,
      message: 'Error del servidor'
    });
  }
};

module.exports = {
  getAboutContent,
  updateAboutContent
};