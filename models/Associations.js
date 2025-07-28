const ContactInfo = require('./ContactInfo');
const Schedule = require('./Schedule');

// Establece la relación de ContactInfo con Schedule
ContactInfo.belongsToMany(Schedule, {
  through: 'contact_schedule_pivot', // Nombre de la tabla pivote
  foreignKey: 'contact_id',         // Clave foránea que apunta a ContactInfo
  otherKey: 'schedule_id',          // Clave foránea que apunta a Schedule
  as: 'horarios'                    // Alias opcional para la relación
});

// Establece la relación inversa de Schedule con ContactInfo
Schedule.belongsToMany(ContactInfo, {
  through: 'contact_schedule_pivot',
  foreignKey: 'schedule_id',        // Clave foránea que apunta a Schedule
  otherKey: 'contact_id',           // Clave foránea que apunta a ContactInfo
  as: 'contactos'                   // Alias opcional para la relación
});

module.exports = { ContactInfo, Schedule };