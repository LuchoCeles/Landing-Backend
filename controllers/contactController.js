const ContactInfo = require('../models/ContactInfo');

const getContactInfo = async (req, res) => {
  try {
    const contactInfo = await ContactInfo.findOne();
    res.json(contactInfo);
  } catch (error) {
    console.error('Error fetching contact info:', error);
    res.status(500).json({ message: 'Server error' });
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