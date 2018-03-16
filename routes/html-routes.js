var db = require("../models");
module.exports = function(app){

	app.get("/", function(req, res) {
	// If the user already has an account send them to the dashboard page
	if (req.user) {
	  	res.render("dashboard");
	}
		res.redirect("/signin");
	});

	app.get('/signup', function(req,res){
		res.render('signup');
	});

	app.get("/signin", function(req, res) {
		// If the user already has an account send them to the members page
		if (req.user) {
		  	res.render("dashboard");
		}
			res.render('signin');
		});

//this requires some more tweaks to include the session as a middleware 
//function so that it is available in every path.

	app.get("/dashboard", function(req, res) {
		console.log("Is there a session? ", req.mySession);

		if (req.mySession && req.mySession.user) { // Check if session exists
		    let userName =  req.mySession.user.user_name;
		     console.log(userName);

		    let loggedInUser = req.mySession.user; 
	        res.locals.user = loggedInUser;			 
	        res.render('dashboard', {"userId" : loggedInUser.id});
	  	} else {
		  	console.log("in else");
		    res.redirect('/signin');
		  }
	});

}
