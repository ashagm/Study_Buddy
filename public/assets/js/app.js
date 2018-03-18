$(function() {
	$('#join-button').on('click', function(event) {
		let userId = ($(this).attr('data-userId'));
		let groupId = ($(this).attr('data-groupId'));
		console.log(userId);
		console.log(groupId);
		let userJoin = {
			userId: userId,
			groupId:groupId
		};
		$.post('/api/joingroup/' + groupId + '/' + userId, userJoin)
		.then(function() {
			console.log('Joined group!');
		});
		location.reload();
	});

	$('.create-details').on('click', function(event) {
		let time = $('#details-time').val();
		let location = $('#details-location').val();
		if (time.length === 0 || time === null || location.length === 0 || location === null) {
			alert('Please fill in a time and location for your study group!');
		}
		window.reload();
	});
});