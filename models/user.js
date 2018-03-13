module.exports = function(sequelize, datatypes) {
	const User = sequelize.define('user', {
		first_name: datatypes.STRING,
		last_name: datatypes.STRING,
		user_email: datatypes.STRING,
		user_name: datatypes.STRING,
		user_password: datatypes.STRING,
	});

	return User;
};
