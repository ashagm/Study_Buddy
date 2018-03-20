$(function() {
	destroyGroup = (groupId) => {
		$.ajax({
      		method: "DELETE",
      		url: "/api/deletegroup/" + groupId
    	}).then(function() {
      		console.log('group deleted');
      		location.href = "/dashboard"
    	});
	};

	$('#join-button').on('click', function(event) {
		let userId = ($(this).attr('data-userId'));
		let groupId = ($(this).attr('data-groupId'));
		let userName = $(this).attr('data-userName');
		let userJoin = {
			userId: userId,
			groupId:groupId,
			userName: userName
		};
		$.post('/api/joingroup/' + groupId + '/' + userId + '/' + userName, userJoin)
		.then(function() {
			console.log('Joined group!');
		});
		location.reload();
	});

	$('.create-details').on('click', function(event) {
		// event.preventDefault();
		let time = $('#details-time').val();
		let location = $('#details-location').val();
		if (time.length === 0 || time === null || location.length === 0 || location === null) {
			alert('Please fill in a time and location for your study group!');
		}
	});

	$('#delete-group').on('click', function(event) {
		let groupId = ($(this).attr('data-groupId'));
		if(confirm('Are you sure you want to delete your group? (This cannot be undone)')) {
			alert('Your group has been deleted');
			destroyGroup(groupId);
		};
	});
});