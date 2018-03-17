$(document).ready(function(){
	$("#btn-create-grp").on('click', function(e){
		e.preventDefault();
		
		 var newGroup = {
	    	groupName : $("#group-name").val().trim(),
	      	groupDesc: $("#group-desc").val().trim()
	    };

	    console.log(newGroup);

		$.ajax("/api/group", {
			type: "POST",
			data: newGroup
		}).then(
			function(result) {
				console.log("Registered new group");
			}
		);

	});

});