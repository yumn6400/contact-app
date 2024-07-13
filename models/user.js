module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: { type: DataTypes.STRING, allowNull: false },
    phoneNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING, allowNull: false }
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Contact, { as: 'contacts', foreignKey: 'userId' });
  };
  return User;
};
