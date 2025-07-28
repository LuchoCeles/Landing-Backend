const About = require('../models/About');

const getAboutContent = async (req, res) => {
  try {
    const about = await About.findOne({attributes: ['id', 'content']});
    res.json(about);
  } catch (error) {
    console.error('Error fetching about content:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

const updateAboutContent = async (req, res) => {
  const { content } = req.body;

  try {
    let about = await About.findOne({attributes: ['id', 'content']});
    
    if (!about) {
      about = await About.create({ content });
    } else {
      about.content = content;
      await about.save();
    }

    res.json(about);
  } catch (error) {
    console.error('Error updating about content:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getAboutContent,
  updateAboutContent
};