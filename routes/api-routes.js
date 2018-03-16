// var User = require("../models/user.js");
var db = require("../models");

const bcrypt = require('bcrypt');
const saltRounds = 10;

module.exports = function(app) {

/* ------------------- USER MODEL ROUTES ---------------------------------*/

    app.get("/api/all", function(req, res) {
        db.user.findAll({}).then(function(results) {
          res.json(results);
        });
    });

    app.post("/api/signup", function(req, res) {
        const newUser = req.body;

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
                console.log("New user Created in the Database");
                res.redirect("/signin");
            }).catch(function(err) {
                console.log(err);
                res.json(err);
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
            console.log("dbUser", dbUser.user_password);
            console.log("reqPassword", reqPassword);
            // res.json(dbUser);

            bcrypt.compare(reqPassword, dbUser.user_password, function(err, result) {
                console.log("bcrypt response", result);
                if(result) {
                    console.log("passwords match");
                    req.mySession.user = dbUser;

                        db.user_status.create({
                          user_id: dbUser.id,
                          user_status: true
                        }).then(function(result){
                            console.log(result);
                        }).catch(function(err) {
                            console.log(err);
                        });  

                    res.redirect('/dashboard');
                } else {
                    console.log("passwords dont match");
                    //redirect to right place //todo
                    res.json(err);
                } 
            });

        }).catch(function(err){
            console.log(err);
        });
    }); 

    app.post('/api/signout', function(req,res){
        console.log("Signing out User", req.body.userId);
        
        db.user_status.destroy({
            where: {
                user_id: req.body.userId
            }
        }).then(function(result) {
            res.redirect('/signout');
        });
        
    });


/* ------------------- GROUP MODEL ROUTES ---------------------------------*/ 
    
    //display all groups
    
    app.get("/api/groups", function(req, res) {

    });

}