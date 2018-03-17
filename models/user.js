//WILL GET BACK TO THIS TO RESOLVE CONFLICTS

// 'use strict';
// module.exports = (sequelize, DataTypes) => {
//   var user = sequelize.define('user', {
//     first_name: DataTypes.STRING,
//     last_name: DataTypes.STRING,
//     user_name: DataTypes.STRING,
//     user_password: DataTypes.STRING,
//     user_email: DataTypes.STRING
//   }, {});
//   user.associate = function(models) {
//     // associations can be defined here
//     user.belongsToMany(models.group, { through: 'user_groups' });
//     // user.hasMany(models.group_member_message);
//     user.hasOne(models.user_status);
//   };
//   return user;

var bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function(sequelize, DataTypes) {
	const User = sequelize.define('user', {
		first_name: { 
						type: DataTypes.STRING, 
						unique: false, 
						allowNull: false, 
						validate: { notEmpty: true}
					},
		last_name: { 
						type: DataTypes.STRING, 
						unique: false, 
						allowNull: false, 
						validate: { notEmpty: true}
					},
		user_email: { 
						type: DataTypes.STRING, 
						unique: true, 
						allowNull: false, 
						validate: { notEmpty: true}
					},
		user_name: { 
						type: DataTypes.STRING, 
						unique: true, 
						allowNull: false, 
						validate: { notEmpty: true}
					},
		user_password: { 
						type: DataTypes.STRING, 
						unique: false, 
						allowNull: false, 
						validate: { notEmpty: true}
					}
	});

	return User;

};