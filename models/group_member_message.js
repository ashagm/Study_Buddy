'use strict';
module.exports = (sequelize, DataTypes) => {
  var group_member_message = sequelize.define('group_member_message', {
    groupId: DataTypes.INTEGER,
    userId: DataTypes.INTEGER,
    user_name: DataTypes.STRING,
    message_text: DataTypes.STRING
  }, {});
  group_member_message.associate = function(models) {
    // associations can be defined here
    group_member_message.belongsTo(models.user, {foreignKey : 'userId'});
  };
  return group_member_message;
};