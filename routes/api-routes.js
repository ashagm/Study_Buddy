// var db = require("../models");
const express = require('express');
const router = express.Router();
const models = require('../models/index.js');
var nodemailer = require('nodemailer');

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
            console.log("New user Created in the Database");
            sendEmail(newUser);
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
    console.log(req.body);
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
                        login_status: true,
                        userId : dbUser.id
                    }).then(function(status){
                        console.log("You are online!", status)
                    });

                    models.group_member.update({
                        online_status: true 
                    }, { where: { userId: dbUser.id }   
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
        where : {
            userId : req.body.userId
            }
        }).then(function(status){
            console.log("You are offline!", status);
            
            models.group_member.update({
            online_status: false }, {
            where: {
                userId: req.body.userId
            }
        }).then(function(result) {
            res.redirect('/signout');
        });  
    });     
});

/* ------------------- GROUP MODEL ROUTES ---------------------------------*/ 
    
/* ----------------------DISPLAY ALL GROUPS --------------------------------*/

router.get("/api/all/groups", function(req, res) {
    models.group.findAll({
        include: [{ 
            model: models.user,
                through: {
                  attributes: ['userId', 'groupId', 'is_admin', 'is_joined'],
                }             
            }]
        }).then(function(allGroups) {
            res.render("dashboard", 
                    {
                        groups: allGroups, 
                        user: req.mySession.user,
                        displayAll: true
                    });          
        });  
});

router.get("/api/all/groups/:userId", function(req, res) {
    models.group_member.findAll({
        where:{
            is_joined: true
        }
    }).then(function(group_member) {
        console.log(group_member);
        models.group.findAll({
        }).then(function(groups) {
            models.user.findAll({
                where: { id: req.params.userId}
            })              
            res.render("allgroups", 
                {
                    groups: groups, 
                    user: req.mySession.user,
                    status: group_member
                });
            });
        });    
});

/* -------------------DISPLAY GROUPS ON SEARCH ---------------------------------*/

router.get("/api/search/:term", function(req, res) {
    let searchTerm = req.params.term;

    models.group.findAll({
        where :{
            group_name: {
                $like: searchTerm + '%'
            }
        }
    }).then(function(groups) {   
        console.log(groups);    
        // res.json(JSON.stringify(groups)) ;   
        res.render('dashboard', 
            { 'groups' : groups,
               user: req.mySession.user,
               displayAll: true });
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
            res.render("dashboard", 
                    {
                        groups: groups, 
                        user: req.mySession.user,
                        displayAll: false
                    });          
        });  
});

/*------------------------- DISPLAY GROUPS YOU ADMIN ------------------------------*/

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
        console.log(results);
        res.render('dashboard', { 
            groups : results,
            user: req.mySession.user,
            displayAll: false,
            isAdmin : true });
    }); 
});

/* ------------------- JOIN GROUP ROUTE ---------------------------------*/ 

router.post('/api/joingroup/:groupId/:userId/:userName', function(req, res) {
    // console.log("in join group");
    let userId = req.params.userId;
    let groupId = req.params.groupId;
    let userName = req.params.userName;

    models.group_member.create({
        userId: userId,
        groupId: groupId,
        user_name: userName,
        is_admin: false,
        is_joined: true,
        online_status: true,
    }).then(function(result) {
        console.log("You have joined the group!", result);
        res.redirect('back');
    });
});

/* ------------------- USER PROFILE ROUTE ---------------------------------*/ 

router.get('/user/:id', function(req, res) {
    console.log("In USER PROFILE");
    models.user.findAll({
        where: { id: req.params.id },
        include: [
            {
                model: models.group,
                through: {
                  attributes: ['userId', 'groupId'],
                  where: {is_joined: true, userId : req.params.id}
                }     
            }
        ]
    }).then(function(results) {
        console.log("Results :", results);
        res.render('profile', {
            user: results
        });
    });
});

/*------------------------DISPLAY SPECIFIC GROUP (ASHA) -------------------------------*/

router.get('/api/group/:groupId/:userId', function(req, res) {

    models.group.findOne({
        where: {id : req.params.groupId},
        include: [
            { 
                model: models.group_details,
                where: {groupId : req.params.groupId},
                attributes: ['grp_date_time', 'grp_location']        
            },
            {
                model: models.user,
                through: {
                  attributes: ['userId', 'groupId', 'user_name', 'is_admin', 'is_joined', 'online_status'],
                  where: {is_joined: true}
                } 
            }
            ]
        }).then(function(result){
            console.log(result);
            models.group_member_message.findAll({
                    where:{
                        groupId : req.params.groupId
                    }   
                 
            }).then(function(subResult){
                res.render('user', {'group': result, 'user': req.mySession.user, 'messages': subResult});
            });            
        });
});


/*------------------------Display specific group (COLE)--------------------------*/

router.get('/group/:groupId/:userId', function(req, res) {
    let userId = req.params.userId;
    let groupId = req.params.groupId;
    models.group_details.findAll({
        where: { groupId: groupId }
    }).then(function(details) {
        models.user.findAll({
            where: { id: userId }
        }).then(function(user) {
            models.group.findAll({
                where: { id: groupId }
            }).then(function(group) {
                models.group_member.findAll( {
                    where: { userId: userId,
                             groupId: groupId 
                            }
                }).then(function(group_member) {
                    models.group_member.findAll({
                        where: { groupId: groupId }
                    }).then(function(group_members) {
                        models.group_member_message.findAll({
                            where: { groupId: groupId }
                            }).then(function(group_member_message) {
                                if(group_member.length === 0) {
                                    console.log('not a member');
                                    res.render('details', {
                                        details: details, 
                                        user: user, 
                                        group: group, 
                                        group_member: false,
                                        group_members: group_members,
                                        group_member_message: group_member_message
                                    });
                                } else {
                                     res.render('group', {
                                        details: details, 
                                        user: user, 
                                        group: group, 
                                        group_member: group_member,
                                        group_members:group_members,
                                        group_member_message: group_member_message,
                                        is_joined: true
                                    });
                                 };
                            });
                        });   
                    });
                });
            });
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
                is_joined: true,
                online_status : true
            }).then(function(subResult){
                models.group_details.create({
                    groupId: result.id,
                    grp_location: newGroup.groupLocation,
                    grp_date_time: newGroup.groupDateTime
                }).then(function(finalresult) {
                    console.log("New group_member row Created!!"); 
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

/* --------------------DELETE GROUP -------------------------------------*/

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

/* --------------------POST MESSAGE DETAILS -------------------------------------*/

router.post('/api/postmessage/:groupId/:userId/:userName', function(req, res) {
    console.log(req.params);
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


/* ------------------- LEAVE GROUP ROUTE ---------------------------------*/ 

router.delete('/api/leavegroup/:userId/:groupId', function(req, res) {
    let groupId = req.params.groupId;
    let userId = req.params.userId;
    models.group_member.destroy({
        where: {
            userId: userId,
            groupId: groupId
        }
    }).then(function(result) {
        console.log('user left');
    });
});

/*----------------------SEND EMAIL ----------------------------------------*/

function sendEmail(newUser){
    console.log(newUser);

    var transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'study.buddy.rcb@gmail.com',
        pass: 'studybuddy123'
      },
      tls: {
        rejectUnauthorized: false
      }
    });

    var mailOptions = {
      from: 'study.buddy.rcb@gmail.com',
      to: newUser.email,
      subject: 'Hello there StudyBuddy!',
      text: 'You are now registered into Study Buddy!'
    };

    transporter.sendMail(mailOptions, function(error, info){
      if (error) {
        console.log(error);
      } else {
        console.log('Email sent to: ',  newUser.email);
        console.log('Response got :', info.response);
      }
    });
}

module.exports = router;
