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
	},
	{
		classMethods: {
			validPassword: function(inputPswd, rightPswd, callback) {
				console.log('validPassword -inputPswd', inputPswd);
				console.log('validPassword -rightPswd', rightPswd);
			
				bcrypt.compare(inputPswd, rightPswd, function(err, isMatch) {
					console.log('isMatch', isMatch);

					if (isMatch) {
						console.log('found match');
						return callback(null, true);
					} else {
						console.log('returning false');
						return callback(null, false);
					}
				});
      		}
    	}

	},
	{
    	dialect: 'mysql'
  	});


	User.hook('beforeCreate', function(user, {}, next) {

		bcrypt.genSalt(saltRounds, function(err, salt) {
			if (err) {
				return next(err);
			}  
			bcrypt.hash(user.password, salt, function(err, hash) {
				if (err) {
					return next(err);
				}      
				user.password = hash;
				console.log('hashedPassword-', hash);
				return next(null, user);
			});
		});
	});

	return User;
};