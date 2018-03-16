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