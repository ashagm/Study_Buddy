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
            console.log(result);
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
        console.log("dbUser", dbUser);
        res.json(dbUser);

        bcrypt.compare(reqPassword, dbUser.user_password, function(err, res) {
            if(res) {
                console.log("passwords match");
                //redirect to right place //todo

            } else {
                console.log("passwords dont match");
                //redirect to right place //todo
            } 
        });
    }).catch(function(err){
        console.log(err);
    });
});  
}