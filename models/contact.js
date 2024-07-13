  module.exports = (sequelize, DataTypes) => {
  const Contact = sequelize.define('Contact', {
    name: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.STRING, allowNull: false },
    spamCount: { type: DataTypes.INTEGER, defaultValue: 0 }
  }, {});
  Contact.associate = function(models) {
    Contact.belongsTo(models.User, { as: 'user', foreignKey: 'userId' });
  };
  return Contact;
};
