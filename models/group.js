'use strict';
module.exports = (sequelize, DataTypes) => {
  var group = sequelize.define('group', {
    group_name: DataTypes.STRING,
    group_desc: DataTypes.STRING
  }, {});
  group.associate = function(models) {
    // associations can be defined here
    group.hasMany(models.group_member)
    group.hasMany(models.group_member_message)
    
    group.hasOne(group_details)
  };
  return group;
};