// models/Associations.js
function setupAssociations() {
  const { ContactInfo, Schedule, Store } = require('./Index');
  
  // Relación 1:1 entre Store y ContactInfo
  Store.hasOne(ContactInfo, {
    foreignKey: 'store_id',
    as: 'contacto',
    onDelete: 'CASCADE'
  });

  ContactInfo.belongsTo(Store, {
    foreignKey: 'store_id',
    as: 'sucursal'
  });

  // Relación 1:N entre Store y Schedule
  Store.hasMany(Schedule, {
    foreignKey: 'store_id',
    as: 'horarios'
  });

  Schedule.belongsTo(Store, {
    foreignKey: 'store_id',
    as: 'sucursal'
  });

  // Relación M:N entre ContactInfo y Schedule
  ContactInfo.belongsToMany(Schedule, {
    through: 'contact_schedule_pivot',
    foreignKey: 'contact_id',
    otherKey: 'schedule_id',
    as: 'horarios'
  });

  Schedule.belongsToMany(ContactInfo, {
    through: 'contact_schedule_pivot',
    foreignKey: 'schedule_id',
    otherKey: 'contact_id',
    as: 'contactos'
  });
}

module.exports = setupAssociations;