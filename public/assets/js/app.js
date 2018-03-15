$(document).ready(function(){

	$("#signup-btn").on('click', function(event){
		event.preventDefault();

	    var newUser = {
	    	firstName : $("#signup-firstname").val().trim(),
	      	lastName: $("#signup-lastname").val().trim(),
	     	email: $("#signup-email").val().trim(),
	     	userName: $("#signup-username").val().trim(),
	      	password: $('#signup-password').val().trim()
	    };

	    $.ajax("/api/signup", {
	      type: "POST",
	      data: newUser
	    }).then(
	      function() {
	        console.log("Registered new User");
	      }
	    );
  });

	$("#signin-btn").on('click', function(event){
		event.preventDefault();

	    var loginUser = {
	     	userName: $("#signin-username").val().trim(),
	      	password: $('#signin-password').val().trim()
	    };

	    console.log(loginUser);

	    $.ajax("/api/signin", {
	      type: "POST",
	      data: loginUser
	    }).then(
	      function(result) {
	      	console.log(result);
	        // console.log("Logged in User");
	      }
	    );

	});

});