// var User = require("../models/user.js");
var db = require("../models");

const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function(app) {

app.get("/api/all", function(req, res) {
    db.user.findAll({}).then(function(results) {
      res.json(results);
    });
});

app.post("/api/signup", function(req, res) {
    const newUser = req.body;
    // console.log("newUser",newUser);

    bcrypt.hash(newUser.password, saltRounds, function(err, hash) {
        newUser.password = hash;

        db.user.create({
          first_name: newUser.firstName,
          last_name: newUser.lastName,
          user_email: newUser.email,
          user_name: newUser.userName,
          user_password: newUser.password
        }).then(function(result){
            // console.log(result);
            // res.render('signin');
            // res.json({id: result.insertId});
        });              
     });

    });  

app.post("/api/signin", function(req, res) {
    const loginUser = req.body;

    let reqPassword = req.body.password;
    let reqUserName = req.body.userName;

    db.user.findOne({
        where: {
            user_name: reqUserName
        }
    }).then(function(dbUser) {
        // console.log("dbUser", dbUser);
        res.json(dbUser);

        bcrypt.compare(reqPassword, dbUser.user_password, function(err, result) {
            if(result) {
                console.log("Passwords match! You are logged in");
                
                // sets a cookie with the user's info
                req.session.user = dbUser;
                //redirect to right place //todo
                
                console.log("Session", req.session);
                console.log("Session user", req.session.user);

            } else {
                console.log("passwords dont match");
                //redirect to right place //todo
            } 
        });
    }).catch(function(err){
        console.log(err);
    });
});  

app.get('/dashboard', function(req, res) {
    console.log("you are in /dashboard");
    console.log(req.session);
    console.log(req.session.user);
  if (req.session && req.session.user) { // Check if session exists
    // lookup the user in the DB by pulling their email from the session
    db.user.findOne({ user_name: req.session.user.user_name }, function (err, user) {
      if (!user) {
        // if the user isn't found in the DB, reset the session info and
        // redirect the user to the login page
        req.session.reset();
        res.redirect('/signin');
      } else {
        // expose the user to the template
        res.locals.user = user;
 
        // render the dashboard page
        res.render('dashboard');
      }
    });
  } else {
    res.redirect('/signin');
  }
});
}