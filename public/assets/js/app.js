$(function() {
	$('#join-button').on('click', function(event) {
		let userId = ($(this).attr('data-userId'));
		let groupId = ($(this).attr('data-groupId'));
		let userJoin = {
			userId: userId,
			groupId:groupId
		};
		$.post('/api/joingroup/' + groupId + '/' + userId, userJoin)
		.then(function() {
			console.log('Joined group!');
		});
		// location.reload();
	});
});