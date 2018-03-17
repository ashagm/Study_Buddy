const express = require('express');
const router = express.Router();
const models = require('../models/index.js');
let sequelizeConnection = models.sequelize;
sequelizeConnection.sync();

router.get('/groups', function(req, res) {
	models.group.findAll({
	}).then(function(groups) {
		models.user.findAll({
			where: { id: 1 }
		}).then(function(user) {
			let data = {
				groups: groups,
				user: user
			};
			res.render('index', {data: data});
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
		where: { group_id: req.params.id }
	}).then(function(details) {
		models.user.findAll({
			where: { id: 1 }
		}).then(function(user) {
			models.group.findAll({
				where: { id: req.params.id }
			}).then(function(group) {
				let data = {
					details: details,
					group: group,
					user: user
				}
				res.render('details', {data:data});
			});
		});
	});
});

router.post('/api/joingroup/:groupId/:userId', function(req, res) {
	models.group.create().then(function() {
		models.group.addUser(models.user, { through: { 
			user_id: req.params.userId,
			group_id: req.params.groupId
		}})
	}).then(function(result) {
		if (result.changedRows === 0) {
	  		return res.status(404).end();
	  	} else {
	  		res.redirect('/groups');
	  	}
	});
});

// router.post('/api/groups/:id/', function(req, res) {
// 	models.group.create({
// 		group_name: req.body.groupName,
// 		group_desc: req.body.description
// 	}).then(function(result) {
// 	  	if (result.changedRows === 0) {
// 	  		return res.status(404).end();
// 	  	} else {
// 	  		res.redirect('/groups');
// 	  	}
// 	});
// });

// router.post('/api/groupdetails/:id/', function(req, res) {
// 	models.group_details.create({
// 		group_name: req.body.groupName,
// 		group_desc: req.body.description
// 	}).then(function(result) {
// 	  	if (result.changedRows === 0) {
// 	  		return res.status(404).end();
// 	  	} else {
// 	  		res.redirect('/groups');
// 	  	}
// 	});
// });

// router.put('/api/updatedetails/:id', function(req, res) {
// 	models.group_details.update({ 
// 		grp_date_time: req.body.time,
// 		grp_location: req.body.location
// 	}, { where: { id: req.params.id }}).then(function(result) {
// 	  	if (result.changedRows === 0) {
// 	  		return res.status(404).end();
// 	  	} else {
// 	  		res.redirect('/groups');
// 	  	}
// 	});
// });

module.exports = router;