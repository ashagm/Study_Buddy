
const express = require('express');
// const study = require('../models/study');

const router = express.Router();

router.get('/', function(req, res){
	res.render('index', { data: 'test data'});
});


module.exports = router;