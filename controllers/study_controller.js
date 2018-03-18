const express = require('express');
const router = express.Router();
const models = require('../models/index.js');
let sequelizeConnection = models.sequelize;
sequelizeConnection.sync();

router.get('/groups', function(req, res) {
	models.group.findAll({
	}).then(function(group) {
		models.user.findAll({
			where: { id: 1 }
		}).then(function(user) {
			let data = {
				group: group,
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

router.get('/details/:groupId/:userId', function(req, res) {
	models.group_details.findAll({
		where: { group_id: req.params.groupId }
	}).then(function(details) {
		models.user.findAll({
			where: { id: req.params.userId }
		}).then(function(user) {
			models.group.findAll({
				where: { id: req.params.groupId }
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
	console.log(req.params);
	console.log(req.params);
	models.group_member.create({
		userId: req.params.userId,
		groupId: req.params.groupId,
		is_admin: false
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