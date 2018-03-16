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
//
	app.get("/dashboard", function(req, res) {
		console.log("Is there a session? ", req.mySession);

		if (req.mySession && req.mySession.user) { // Check if session exists
		    // lookup the user in the DB by pulling their username from the session
		    let userName =  req.mySession.user.user_name;
		    // res.render("dashboard", {"userName" : userName});
		    db.user.findOne(
		    	{ 
		    		user_name: userName
		    	}, function (err, user) {
		    		console.log("found!", user);
			      if (!user) {
			        req.mySession.reset();
			        res.redirect('/signin');
			      } else {
			        // expose the user to the template
			        res.locals.user = user;			 
			        // render the dashboard page
			        res.render('dashboard', {"userName" : userName});
			      }
		    });
	  	} else {
		  	console.log("in else");
		    // res.redirect('/signin');
		  }
		// res.render("dashboard");
	});

}
