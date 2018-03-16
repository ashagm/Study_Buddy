const express = require('express');
const router = express.Router();
const models = require('../models/index.js');
let sequelizeConnection = models.sequelize;
sequelizeConnection.sync();

router.get('/groups', function(req, res) {
	models.group.findAll({
	}).then(function(result) {
		res.render('index', {
			group: result
		});
	});
});

router.get('/user', function(req, res) {
	models.user.findAll({
		where: { id: 1 },
		include: [{model: models.group}]
	}).then(function(result) {
		res.render('profile', {
			user: result
		});
	});
});

router.get('/details/:id', function(req, res) {
	models.group_details.findAll({
		where: { id: req.params.id },
		include: [{model: models.group}]
	}).then(function(result) {
		res.render('details', {
			group_details: result
		});
	});
});

module.exports = router;