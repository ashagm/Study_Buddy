'use strict';
module.exports = (sequelize, DataTypes) => {
  var group_member = sequelize.define('group_member', {
    group_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    is_admin: DataTypes.BOOLEAN
  }, {});
  group_member.associate = function(models) {
    // associations can be defined here
  };
  return group_member;
};