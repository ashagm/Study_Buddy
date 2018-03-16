module.exports = function(sequelize, DataTypes) {
	const User_status = sequelize.define('user_status', {
		user_id:
		 		{ 
					type: DataTypes.INTEGER, 
					allowNull: false, 
					validate: { notEmpty: true},
					primaryKey: true
				},
		user_status: 
				{ 
					type: DataTypes.BOOLEAN, 
					defaultValue: false, 
					validate: { notEmpty: true}
				},

			},
			{
				timestamps: true,
				updatedAt: false,
				createdAt: "last_login_at"
			}
	);

	return User_status;
};