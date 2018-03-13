module.exports = function(sequelize, datatypes) {
	const Subject = sequelize.define('Subject', {
		subject_name: datatypes.STRING,
		location: datatypes.STRING,
		attendees: datatypes.INTEGER,
		status: datatypes.STRING,
	});
	return Subject;
};