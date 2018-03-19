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

	$('.btn-join-grp').on('click', function(e){	

		let userId = ($(this).attr('data-userId'));
		let groupId = ($(this).attr('data-groupId'));

		let userJoinGrp = {
			userId : userId,
			groupId : groupId
		}

		$.post('/api/joingroup/' + groupId + '/' + userId, userJoinGrp)
		.then(function() {
			console.log('Joined group!');
		});

		location.reload();
	});
});