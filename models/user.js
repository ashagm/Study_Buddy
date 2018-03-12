module.exports = function(sequelize, datatypes) {
	const User = sequelize.define('User', {
		first_name: datatypes.STRING,
		last_name: datatypes.STRING,
		email: datatypes.STRING,
		userName: datatypes.STRING,
		user_password: datatypes.STRING,
	});
	return User;
};