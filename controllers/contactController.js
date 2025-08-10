const ContactInfo = require('../models/ContactInfo');
const Schedule = require('../models/Schedule');
const Store = require('../models/Store');

const getContactInfo = async (req, res) => {
  try {
    const results = await ContactInfo.findAll({
      attributes: ['id', 'telefono', 'email', 'whatsapp', 'address'],
      include: [
        {
          model: Store,
          as: 'tienda',
          attributes: ['nombre']
        },
        {
          model: Schedule,
          as: 'horarios',
          attributes: ['dia', 'horario']
        }
      ]
    });

    // Procesamiento para formato más limpio
    const formattedResults = results.map(item => {
      return {
        id: item.id,
        sucursal: item.tienda.nombre,
        telefono: item.telefono,
        email: item.email,
        whatsapp: item.whatsapp,
        address: item.address,
        horarios: item.horarios.map(horario => ({
          dia: horario.dia,
          horario: horario.horario
        }))
      };
    });

    res.json(formattedResults);
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({
      message: 'Server error',
      error: error.message
    });
  }
};

const updateContactInfo = async (req, res) => {
  const contactsData = req.body;

  if (!Array.isArray(contactsData)) {
    return res.status(400).json({
      message: 'Se espera un array de contactos'
    });
  }

  try {
    const transaction = await sequelize.transaction();
    const results = [];

    for (const contactData of contactsData) {
      const { id, telefono, email, whatsapp, address } = contactData;

      try {
        if (!id) {
          results.push({
            error: 'Se requiere el ID del contacto'
          });
          continue;
        }

        const contact = await ContactInfo.findByPk(id, { transaction });

        if (!contact) {
          results.push({
            id,
            error: 'Contacto no encontrado'
          });
          continue;
        }

        // Actualizar solo los campos permitidos
        const camposActualizados = {};
        if (telefono !== undefined) camposActualizados.telefono = telefono;
        if (email !== undefined) camposActualizados.email = email;
        if (whatsapp !== undefined) camposActualizados.whatsapp = whatsapp;
        if (address !== undefined) camposActualizados.address = address;

        // Actualizar solo si hay campos válidos para modificar
        if (Object.keys(camposActualizados).length > 0) {
          await ContactInfo.update(camposActualizados, {
            where: { id },
            transaction
          });

          results.push({
            id,
            success: true,
            campos_actualizados: Object.keys(camposActualizados)
          });
        } else {
          results.push({
            id,
            warning: 'No se proporcionaron campos válidos para actualizar'
          });
        }

      } catch (error) {
        await transaction.rollback();
        console.error(`Error actualizando contacto ${id}:`, error);
        results.push({
          id: id || 'N/A',
          error: error.message
        });
      }
    }

    await transaction.commit();

    res.json({
      message: 'Actualización parcial exitosa',
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