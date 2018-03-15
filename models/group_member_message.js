'use strict';
module.exports = (sequelize, DataTypes) => {
  var group_member_message = sequelize.define('group_member_message', {
    group_id: DataTypes.INTEGER,
    user_id: DataTypes.INTEGER,
    message_text: DataTypes.STRING
  }, {});
  group_member_message.associate = function(models) {
    // associations can be defined here
  };
  return group_member_message;
};