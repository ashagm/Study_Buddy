var db = require("../models");
const express = require('express');
const router = express.Router();
const models = require('../models/index.js');
let sequelizeConnection = models.sequelize;
sequelizeConnection.sync();

const bcrypt = require('bcrypt');
const saltRounds = 10;



/* ------------------- USER MODEL ROUTES ---------------------------------*/

//SHOW ALL USERS
router.get("/api/all", function(req, res) {
    models.user.findAll({}).then(function(results) {
        res.json(results);
    });
});

// SIGNUP
router.post("/api/signup", function(req, res) {
    const newUser = req.body;
    bcrypt.hash(newUser.password, saltRounds, function(err, hash) {
        newUser.password = hash;
        models.user.create({
            first_name: newUser.firstName,
            last_name: newUser.lastName,
            user_email: newUser.email,
            user_name: newUser.userName,
            user_password: newUser.password
        }).then(function(result){
            // console.log(result);
            console.log("New user Created in the Database");
            res.redirect("/signin"); //why is this not working?
        }).catch(function(err) {
            console.log(err);
            res.json(err);
        });                
    });

});  

//SIGNIN
router.post("/api/signin", function(req, res) {
    const loginUser = req.body;
    let reqPassword = req.body.password;
    let reqUserName = req.body.userName;
    console.log("From request", reqPassword, reqUserName);
    models.user.findOne({
        where: {
            user_name: reqUserName
        }
    }).then(function(dbUser) {

        console.log("dbUser", dbUser);
        console.log("reqPassword", reqPassword);
        // res.json(dbUser);
        bcrypt.compare(reqPassword, dbUser.user_password, function(err, result) {
            console.log("bcrypt response", result);
            if(result) {
                console.log("passwords match");
                req.mySession.user = dbUser;
                    models.user_status.create({
                        user_id: dbUser.id,
                        login_status: true
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

//SIGNOUT
router.post('/api/signout', function(req,res){
    console.log("Signing out User", req.body.userId); 
    models.user_status.destroy({
        where: {
            user_id: req.body.userId
        }
    }).then(function(result) {
        res.redirect('/signout');
    });       
});

/* ------------------- GROUP MODEL ROUTES ---------------------------------*/ 
    
/* ----------------------DISPLAY ALL GROUPS --------------------------------*/

router.get("/api/groups", function(req, res) {
    models.group.findAll({}).then(function(groups) {
        // console.log("hbsgroups", groups);
        console.log("Is there a session?", req.mySession.user);
        res.render("allgroups", {groups: groups, user: req.mySession.user});
    });
});


// diplay all groups for the userID to the html
router.get('/groups/:userid', function(req, res) {
    models.group.findAll({
    }).then(function(group) {
        models.user.findAll({
            where: { id: req.params.userid }
        }).then(function(user) {
            console.log(user);
            res.render('index', {group: group, user: user});
        }); 
    });
});

// display clicked group to the html
router.get('/details/:groupId/:userId', function(req, res) {
    models.group_details.findAll({
        where: { groupId: req.params.groupId }
    }).then(function(details) {
        models.user.findAll({
            where: { id: req.params.userId }
        }).then(function(user) {
            models.group.findAll({
                where: { id: req.params.groupId }
            }).then(function(group) {
                models.group_member.findAll( {
                    where: { groupId: req.params.groupId }
                }).then(function(group_member) {
                    res.render('details', {
                        details: details, 
                        user: user, 
                        group: group, 
                        group_member: group_member
                    });
                });   
            });
        });
    });
});

//display user groups ( member and admin)    
router.get("/api/groups/:userId", function(req, res) {
    console.log("you are in the route" , req.params.userId);
    models.group_member.findAll({
        where: {
            user_id : req.params.userId
        }
    }).then(function(results){
            res.json(results);
    }); 
});

/*------------------------- GROUPS YOU ADMIN ------------------------------*/

router.get("/api/admin/:userId", function(req, res) {
    console.log("you are in the route" , req.params.userId);
    models.group_member.findAll({
        where: {
            id : req.params.userId,
            is_admin : true
        }
    }).then(function(results){
        res.json(results);
    }); 
});
       
/*------------------------CREATE GROUP -------------------------------------*/

router.post("/api/group", function(req, res) {
    console.log("Creating new group for user", req.mySession.user.id);
    let newGroup = req.body;
        models.group.create({
            group_name: newGroup.groupName,
            group_desc: newGroup.groupDesc
        }).then(function(result){
            console.log("New group Created in the Database", result.id);
            db.group_member.create({
                is_admin: true,
                groupId: result.id,
                userId: req.mySession.user.id,
                is_joined: true
            }).then(function(subResult){
                console.log(result.id)
                db.group_details.create({
                    groupId: result.id
                }).then(function(finalresult) {
                    console.log("New group_member row Created!!");
                // res.redirect('/dashboard');
            }).catch(function(err) {
                console.log(err);
            });  
        }).catch(function(err) {
            console.log(err);
            res.json(err);
        });
    });                  
});

router.post('/api/create/groupdetails/:groupId', function(req, res) {
    models.group_details.update({
        groupId: req.params.groupId,
        grp_date_time: req.body.grp_date_time,
        grp_location: req.body.grp_location
    }, {
        where: {groupId: req.params.groupId}
    }).then(function(result) {
        console.log('details added');
        res.redirect('back');
    });
});

/* ------------------- USER PROFILE ROUTES ---------------------------------*/ 
router.get('/user/:id', function(req, res) {
    models.user.findAll({
        where: { id: req.params.id },
        include: [{model: models.group,
                   as: 'groupAlias'
                  }]
    }).then(function(result) {
        res.render('profile', {
            user: result
        });
    });
});

/* ------------------- JOIN GROUP ROUTES ---------------------------------*/ 
router.post('/api/joingroup/:groupId/:userId', function(req, res) {
    console.log("in join group");
    let userId = req.params.userId;
    let groupId = req.params.groupId;
    console.log(userId, groupId);

    models.group_member.create({
        userId: userId,
        groupId: groupId,
        is_admin: false,
        is_joined: true
    }).then(function(result) {
        console.log("You have joined the group!", result);
        res.redirect(req.get('referer'));
    });
});

module.exports = router;





