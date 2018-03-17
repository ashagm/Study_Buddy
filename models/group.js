//WILL HAVE TO GET BACK TO THIS, AND RESOLVE CONFLICTS

// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   var group = sequelize.define('group', {
//     group_name: DataTypes.STRING,
//     group_desc: DataTypes.STRING
//   }, {});
//   group.associate = function(models) {
//     // associations can be defined here
//     group.belongsToMany(models.user, { through: 'user_groups' });
//     group.belongsToMany(models.group_details, { through: 'group_details_joined' });
//     // group.hasMany(models.group_details);
//     // group.hasMany(models.group_member_message);
//   };
//   return group;

module.exports = function(sequelize, DataTypes) {
	const Group = sequelize.define('group', {
		group_id: 	{
						type: DataTypes.INTEGER,
          				allowNull: false,
          				primaryKey: true,
          				autoIncrement: true
					},
		group_name: { 
						type: DataTypes.STRING, 
						allowNull: false, 
						validate: { notEmpty: true}
					},
		group_desc: { 
						type: DataTypes.STRING, 
						allowNull: true
					},

  	});

	return Group;
};