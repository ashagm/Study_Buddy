'use strict';
module.exports = (sequelize, DataTypes) => {
  var user = sequelize.define('user', {
    first_name: DataTypes.STRING,
    last_name: DataTypes.STRING,
    user_name: DataTypes.STRING,
    user_password: DataTypes.STRING,
    user_email: DataTypes.STRING,
  }, {});
  user.associate = function(models) {
    // associations can be defined here
    user.belongsToMany(models.group, { through: 'group_member', foreignKey: 'userId' });
    user.hasMany(models.group_member_message);
  };
  return user;
};
