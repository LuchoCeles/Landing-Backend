const ContactInfo = require('../models/ContactInfo');
const Schedule = require('../models/Schedule');
const { sequelize } = require('../config/database');

const getContactInfo = async (req, res) => {
  try {
    const results = await ContactInfo.findAll({
      attributes: ['telefono', 'email', 'whatsapp'],
      include: [{
        model: Schedule,
        as: 'horarios',
        through: { attributes: [] },
        attributes: ['sucursal'],
        required: true
      }],
      raw: true
    });

    // Procesamiento para formato único
    const uniqueResults = [];
    const seenCombinations = new Set();

    results.forEach(item => {
      const comboKey = `${item.telefono}-${item.email}-${item.whatsapp}-${item['horarios.sucursal']}`;
      
      if (!seenCombinations.has(comboKey)) {
        seenCombinations.add(comboKey);
        uniqueResults.push({
          sucursal: item['horarios.sucursal'],
          telefono: item.telefono,
          email: item.email,
          whatsapp: item.whatsapp
        });
      }
    });

    res.json(uniqueResults);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const updateContactInfo = async (req, res) => {
  const { telefono_rosario, telefono_mdq, email, whatsapp } = req.body;

  try {
    let contactInfo = await ContactInfo.findOne();

    if (!contactInfo) {
      contactInfo = await ContactInfo.create({
        telefono_rosario,
        telefono_mdq,
        email,
        whatsapp
      });
    } else {
      if (telefono_rosario) contactInfo.telefono_rosario = telefono_rosario;
      if (telefono_mdq) contactInfo.telefono_mdq = telefono_mdq;
      if (email) contactInfo.email = email;
      if (whatsapp) contactInfo.whatsapp = whatsapp;

      await contactInfo.save();
    }

    res.json(contactInfo);
  } catch (error) {
    console.error('Error updating contact info:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getContactInfo,
  updateContactInfo
};