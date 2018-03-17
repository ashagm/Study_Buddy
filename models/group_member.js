module.exports = function(sequelize, DataTypes) {
	const Group_member = sequelize.define('group_member', {
		group_id: 	{
						type: DataTypes.INTEGER,
          				allowNull: false,
          				foreignKey: true
					},
		user_id: 	{ 
						type: DataTypes.INTEGER, 
						allowNull: false,
						foreignKey: true, 
						validate: { notEmpty: true}
					},
		is_admin: 	{ 
						type: DataTypes.BOOLEAN, 
						allowNull: false,
						defaultValue: false
					}

  	});

	return Group_member;
};