
'use strict';
module.exports = (sequelize, DataTypes) => {
  var user_status = sequelize.define('user_status', {
    user_id: DataTypes.INTEGER,
    login_status: DataTypes.BOOLEAN,
    last_login_date_time: DataTypes.DATE
  }, {});
  user_status.associate = function(models) {
    // associations can be defined here
    user_status.belongsTo(models.user);
  };
  return user_status;
};