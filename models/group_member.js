'use strict';
module.exports = (sequelize, DataTypes) => {
  var group_member = sequelize.define('group_member', {
    is_admin: DataTypes.BOOLEAN,
    userId: DataTypes.INTEGER,
    groupId: DataTypes.INTEGER
  }, {});
  group_member.associate = function(models) {
    // associations can be defined here
  };
  return group_member;
};