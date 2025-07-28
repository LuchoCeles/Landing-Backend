const axios = require('axios');

const proxyImage = async (req, res) => {
  try {
    const { id } = req.params;
    const carruselItem = await CarruselItem.findByPk(id);
    
    if (!carruselItem) {
      return res.status(404).json({ message: 'Image not found' });
    }

    const response = await axios.get(carruselItem.image_url, {
      responseType: 'stream'
    });

    res.setHeader('Content-Type', response.headers['content-type']);
    response.data.pipe(res);
  } catch (error) {
    console.error('Error proxying image:', error);
    res.status(500).json({ message: 'Error fetching image' });
  }
};

module.exports = proxyImage;