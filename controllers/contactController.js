const ContactInfo = require('../models/ContactInfo');
const Schedule = require('../models/Schedule');

const getContactInfo = async (req, res) => {
  try {
    const results = await ContactInfo.findAll({
      attributes: ['id', 'telefono', 'email', 'whatsapp', 'address_'],
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
      const comboKey = `${item.telefono}-${item.email}-${item.whatsapp}-${item.address_}-${item['horarios.sucursal']}-${item['contact_info.id']}`;

      if (!seenCombinations.has(comboKey)) {
        seenCombinations.add(comboKey);
        uniqueResults.push({
          id: item['id'],
          sucursal: item['horarios.sucursal'],
          telefono: item.telefono,
          email: item.email,
          whatsapp: item.whatsapp,
          address: item.address_
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
  const contactsData = req.body; // Esperamos un array de contactos

  // Validación básica del input
  if (!Array.isArray(contactsData)) return res.status(400).json({ message: 'Se espera un array de contactos' });

  try {
    const results = [];

    for (const contactData of contactsData) {
      const { id, telefono, sucursal, email, whatsapp, address } = contactData;
      if (!id) {
        results.push({
          error: `Contacto sin ID - ${sucursal || 'Sin nombre'}`
        });
        continue;
      }

      try {
        // Buscar el contacto existente
        const contact = await ContactInfo.findOne({ where: { id } });

        if (!contact) {
          results.push({
            error: `Contacto no encontrado - ID: ${id}`
          });
          continue;
        }

        if (telefono !== undefined) contact.telefono = telefono;
        if (sucursal !== undefined) contact.sucursal = sucursal;
        if (email !== undefined) contact.email = email;
        if (whatsapp !== undefined) contact.whatsapp = whatsapp;
        if (address !== undefined) contact.address = address;

        await contact.save();
        results.push({
          success: true,
          id: contact.id,
          sucursal: contact.sucursal
        });

      } catch (error) {
        console.error(`Error actualizando contacto ${id}:`, error);
        results.push({
          error: `Error actualizando contacto ${id}`
        });
      }
    }

    // Verificar si hubo errores
    const hasErrors = results.some(result => result.error);

    if (hasErrors) {
      return res.status(207).json({ // 207 Multi-Status
        message: 'Algunos contactos no se actualizaron correctamente',
        results
      });
    }

    res.json({
      success: true,
      message: 'Todos los contactos actualizados correctamente',
      results
    });

  } catch (error) {
    console.error('Error en el proceso de actualización:', error);
    res.status(500).json({
      message: 'Error interno del servidor',
      error: error.message
    });
  }
};

module.exports = {
  getContactInfo,
  updateContactInfo
};