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