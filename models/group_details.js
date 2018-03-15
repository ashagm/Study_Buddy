'use strict';
module.exports = (sequelize, DataTypes) => {
  var group_details = sequelize.define('group_details', {
    group_id: DataTypes.INTEGER,
    grp_date_time: DataTypes.STRING,
    grp_location: DataTypes.STRING
  }, {});
  group_details.associate = function(models) {
    // associations can be defined here
  };
  return group_details;
};