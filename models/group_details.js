'use strict';
module.exports = (sequelize, DataTypes) => {
  var group_details = sequelize.define('group_details', {
    group_id: DataTypes.INTEGER,
    grp_date_time: DataTypes.STRING,
    grp_location: DataTypes.STRING
  }, {});
  group_details.associate = function(models) {
    // associations can be defined here
    group_details.belongsToMany(models.group, { through: 'group_details_joined' });
  };
  return group_details;
};