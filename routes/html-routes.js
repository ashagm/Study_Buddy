module.exports = function(app){
	app.get('/', function(req, res) {
    	res.redirect('/signin');
	});

	app.get('/signup', function(req,res){
		res.render('signup');
	});

	app.get('/signin', function(req,res){
		res.render('signin');
	});
}