'use strict';
module.exports = (sequelize, DataTypes) => {
  var group = sequelize.define('group', {
    group_name: DataTypes.STRING,
    group_desc: DataTypes.STRING
  }, {});
  group.associate = function(models) {
    // associations can be defined here
    group.belongsToMany(models.user, { through: 'userGroups', foreignKey: 'user_id' });
    group.belongsToMany(models.group_details, { through: 'allGroupDetails', foreignKey: 'group_details_id' });
    group.hasMany(models.group_member)
    group.hasMany(models.group_member_message)
  };
  return group;
};