'use strict';
module.exports = (sequelize, DataTypes) => {
  var group = sequelize.define('group', {
    group_name: DataTypes.STRING,
    group_desc: DataTypes.STRING
  }, {});
  group.associate = function(models) {
    // associations can be defined here
    group.belongsToMany(models.user, { through: 'user_groups' });
    group.belongsToMany(models.group_details, { through: 'group_details_joined' });
    // group.hasMany(models.group_details);
    // group.hasMany(models.group_member_message);
  };
  return group;
};