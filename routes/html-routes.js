var db = require("../models");
module.exports = function(app){

	app.get("/", function(req, res) {
		if (req.mySession && req.mySession.user) {
		  	res.render('dashboard', {"user" : req.mySession.user});
		}else{
			res.redirect("/signin");
		}
	});

	app.get('/signup', function(req,res){
		res.render('signup');
	});

	app.get("/signin", function(req, res) {
		res.render('signin');
	});
	
	app.get("/userpage",function(req,res){
		res.render('userpage');
	});

	app.get('/signout', function(req,res){
		console.log("You are now signing out ....");	 	
	 	req.mySession.destroy();
	 	console.log("Session exists after Signout??", req.mySession)
	 	console.log("redirecting to /");
  		res.redirect('/');
	});

//this requires some more tweaks to include the session as a middleware 
//function so that it is available in every path.

	app.get("/dashboard", function(req, res) {
		console.log("Is there a session? ", req.mySession);

		if (req.mySession && req.mySession.user) { // Check if session exists
		    let userName =  req.mySession.user.user_name;
		    console.log("Welcome ", userName);

		    let loggedInUser = req.mySession.user; 
	        res.locals.user = loggedInUser;		
	        // console.log(res.locals); //check how to access from locals

	        db.user_status.findAll({
		        where: {
		            login_status : true
		        }        
		    }).then(function(results) {
		        // res.render('dashboard', {"users" : results.length});
		        res.render('dashboard', {"user" : loggedInUser , "total" : results.length});
		    });

	        // res.render('dashboard', {"user" : loggedInUser});
	  	} else {
		  	console.log("in else");
		    res.redirect('/signin');
		  }
	});

}

