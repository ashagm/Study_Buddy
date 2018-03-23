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
	        window.location.replace('/signin');
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
	      function(data) {
	      	console.log("result from ajax request returned");
	      	console.log(data);
	      	window.location.replace("/dashboard");
	      }
	    );
	});

	$("#signout-btn").on('click', function(event){
		console.log("Signout button clicked");
		event.preventDefault();
	    var logoutUser = {
	     	userId: $(this).attr('data-id')
	    };
	    console.log(logoutUser);
	    $.ajax("/api/signout", {
	      type: "POST",
	      data: logoutUser
	    }).then(
	      function(result) {
	      	console.log("result from ajax request returned");
	      	window.location.replace("/");
	      }
	    );
	});

	$('#signup-confirm-password').on('keyup', function () {
		if ($('#signup-password').val() == $('#signup-confirm-password').val()) {
			$('#message').html('Matching!!').css('color', 'green');
		} else 
		$('#message').html('Not Matching Yet!!').css('color', 'red');
	});
});