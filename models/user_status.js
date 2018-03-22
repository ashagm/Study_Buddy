
'use strict';
module.exports = (sequelize, DataTypes) => {
  var user_status = sequelize.define('user_status', {
    userId: DataTypes.INTEGER,
    login_status: 
        { 
          type: DataTypes.BOOLEAN, 
          defaultValue: false
        }
    // last_login_date_time: DataTypes.DATE
  }, {});
  user_status.associate = function(models) {
    // associations can be defined here
    user_status.belongsTo(models.user, {foreignKey : 'userId'});
  };
  return user_status;
};