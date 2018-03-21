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
            res.redirect("/"); //why is this not working?
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
    models.group.findAll({})
        .then(function(groups) {
            // console.log("Is there a session?", req.mySession.user);
            models.group_member.findAll({
                where:{
                    is_joined: false
                }
            }).then(function(grpStatus) {
                models.user.findAll({
                    where: { id: req.params.userId}
                })  
                console.log(grpStatus[0]);            
                res.render("allgroups", 
                    {
                        groups: groups, 
                        user: req.mySession.user,
                        status: grpStatus
                    });
            });
        });    
});

/* -------------------DISPLAY GROUPS ON SEARCH ---------------------------------*/

router.get("/api/search/:term", function(req, res) {
    let searchTerm = req.params.term;

    models.group.findAll({
        where :{
            group_desc: {
                $like: searchTerm + '%'
            }
        }
    }).then(function(groups) {   
        // console.log(groups);    
        res.json(groups) ;   
        // res.render('searchgroups', { 'groups' : groups });
    });    
});
        

/* ----------------------DISPLAY GROUPS JOINED--------------------------------*/

router.get("/api/mygroups", function(req, res) {
    var userID = req.mySession.user.id;
    models.group.findAll({
        include: [{ 
            model: models.user,
                through: {
                  attributes: ['userId', 'groupId', 'is_admin', 'is_joined'],
                  where: {is_joined: true, userId : userID}
                }             
            }]
        }).then(function(groups) {
            // console.log(groups);
            res.render("displaygroups", 
                    {
                        groups: groups, 
                        user: req.mySession.user,
                    });   
            // res.json(groups);        
        });  
});

/*------------------------- GROUPS YOU ADMIN ------------------------------*/

router.get("/api/admin/:userId", function(req, res) {
    console.log("you are in the route" , req.params.userId);
    models.group_member.findAll({
        where: {
            userId : req.params.userId,
            is_admin : true
        }
    }).then(function(results){
        res.json(results);
    }); 
});

router.get("/api/admin", function(req, res) {
    var userID = req.mySession.user.id;

    models.group.findAll({
        include: [{ 
                    model: models.user,
                    through: {
                      attributes: ['userId', 'groupId', 'is_admin'],
                      where: {is_admin: true, userId : userID,}
                    }             
                }]
    }).then(function(results){
        // console.log(results);
        res.render('displaygroups', { 'groups' : results });
        // res.json(results);
    }); 
});



/*------------------------DISPLAY SPECIFIC GROUP -------------------------------*/

// display clicked group to the html
router.get('/api/group/:groupId/:userId', function(req, res) {

    // console.log(req.params.groupId);
    // console.log(req.params.userId);

    models.group.findOne({
        where : {
            id : req.params.groupId
        }
    }).then(function(group) {
        models.group_details.findOne({
            where: { groupId: req.params.groupId }
        }).then(function(details){
            console.log("details", details);
            models.group_member.findAll( {
                    where: { groupId: req.params.groupId }
            }).then(function(grpMembers){
                //todo: get usernames from userIds after this
                res.render('group', {
                    group: group, 
                    user: req.mySession.user,
                    details: details,
                    members: grpMembers
                });
            });       
        });
    });
});

/*------------------------Display User specific  groups --------------------------*/

router.get('/groups/:userid', function(req, res) {
    models.group.findAll({
    }).then(function(group) {
        models.user.findAll({
            where: { id: req.params.userid }
        }).then(function(user) {
            res.render('index', {group: group, user: user});
        }); 
    });
});

/* ------------------- JOIN GROUP ROUTE ---------------------------------*/ 

router.post('/api/joingroup/:groupId/:userId/:userName', function(req, res) {
    console.log("in join group");
    let userId = req.params.userId;
    let groupId = req.params.groupId;
    let userName = req.params.userName;
    models.group_member.create({
        userId: userId,
        groupId: groupId,
        user_name: userName,
        is_admin: false,
        is_joined: true
    }).then(function(result) {
        console.log("You have joined the group!", result);
        res.redirect('back');
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
                    models.group_member_message.findAll({
                        where: { groupId: req.params.groupId}
                    }).then(function(group_member_message) {
                        res.render('details', {
                            details: details, 
                            user: user, 
                            group: group, 
                            group_member: group_member,
                            group_member_message: group_member_message
                        });
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


/*------------------------CREATE GROUP -------------------------------------*/

router.post("/api/group", function(req, res) {
    console.log("Creating new group for user", req.mySession.user.id);
    let newGroup = req.body;
        models.group.create({
            group_name: newGroup.groupName,
            group_desc: newGroup.groupDesc
        }).then(function(result){
            console.log("New group Created in the Database", result.id);
            models.group_member.create({
                is_admin: true,
                groupId: result.id,
                userId: req.mySession.user.id,
                user_name: req.mySession.user.user_name,
                is_joined: true
            }).then(function(subResult){
                models.group_details.create({
                    groupId: result.id
                }).then(function(finalresult) {
                    console.log("New group_member row Created!!");
                    models.group_member_message.create({
                        groupId: result.id,
                        message_text: 'Post your messages here!',
                    }).catch(function(err) {
                        console.log(err);
                    });  
                }).catch(function(err) {
                    console.log(err);
                    res.json(err);
                });
            });                  
        });
});

/* --------------------__CREATE GROUP DETAILS -------------------------------------*/

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

/* --------------------DELETE GROUP DETAILS -------------------------------------*/

router.delete('/api/deletegroup/:groupId', function(req, res) {
    let groupId = req.params.groupId;
    models.group.destroy({
        where: {
            id: groupId
        }
        }).then(function(result) {
            models.group_member.destroy({
                where: {
                    groupId: groupId
                }
                }).then(function(subResult) {
                    models.group_details.destroy({
                        where: {
                            groupId: groupId
                        }
                        }).then(function(finalresult) {
                            console.log('group deleted');
                        });
                });
        });
});


// post message
router.post('/api/postmessage/:groupId/:userId/:userName', function(req, res) {
    models.group_member_message.create({
        groupId: req.params.groupId,
        userId: req.params.userId,
        user_name: req.params.userName,
        message_text: req.body.message_text
    }).then(function(result) {
        console.log('message posted!');
        res.redirect('back');
    });
});

/* ------------------- USER PROFILE ROUTES ---------------------------------*/ 
router.get('/user/:id', function(req, res) {
    console.log("In USER PROFILE");
    models.user.findOne({
        where: { id: req.params.id },
        // include: [{model: models.group}]
    }).then(function(result) {
        console.log("Results :", result);
        res.render('profile', {
            user: result
        });
    });
});

module.exports = router;





