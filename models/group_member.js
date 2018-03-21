'use strict';
module.exports = (sequelize, DataTypes) => {
  var group_member = sequelize.define('group_member', {
    is_admin:  { 
                  type: DataTypes.BOOLEAN, 
                  defaultValue: false
               },
    userId: DataTypes.INTEGER,
    user_name: DataTypes.STRING,
    groupId: DataTypes.INTEGER,
    user_name: DataTypes.STRING,
    is_joined: DataTypes.BOOLEAN,
    online_status: DataTypes.BOOLEAN,
  }, {});
  group_member.associate = function(models) {
    // associations can be defined here
  };
  return group_member;
};
