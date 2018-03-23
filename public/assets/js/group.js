$(document).ready(function(){
	$("#btn-create-grp").on('click', function(e){
		e.preventDefault();
		 var newGroup = {
	    	groupName : $("#group-name").val().trim(),
	      	groupDesc: $("#group-desc").val().trim(),
	      	groupLocation: $("#group-location").val().trim(),
	      	groupDateTime: $("#group-datetime").val().trim(),

	    };
	    console.log(newGroup);
		$.ajax("/api/group", {
			type: "POST",
			data: newGroup
		}).then(
			function(result) {
				console.log("Registered new group");
				location.reload();
			}
		);
	});

	$('.btn-join-grp').on('click', function(e){	
		let userId = ($(this).attr('data-userId'));
		let groupId = ($(this).attr('data-groupId'));
		let userName = ($(this).attr('data-userName'));

		let $self = $(this);

		let userJoinGrp = {
			userId : userId,
			groupId : groupId,
			userName : userName
		}

		$.post('/api/joingroup/' + groupId + '/' + userId + "/" + userName, userJoinGrp)
		.then(function(result) {
			$self.html('JOINED!');
			$self.css("background-color", "grey");
			$self.attr('disabled', true);
			location.reload();
		});		
	});

	 $('.btn-goto-grp').on('click', function(e){	

	 	let userId = ($(this).attr('data-userId'));
	 	let groupId = ($(this).attr('data-groupId'));

	 	let userGotoGrp = {
			userId : userId,
	 		groupId : groupId
	 	}

		$.get('/api/group/' + groupId + '/' + userId, userGotoGrp)
		.then(function() {
			console.log('Goto group!');
			window.location.replace('/api/group/' + groupId + '/' + userId)
	 	});

	// 	// location.reload();
	 });

	$('.btn-group-details').on('click', function(event) {
		// event.preventDefault();
		let time = $('#details-time').val();
		let location = $('#details-location').val();
		if (time.length === 0 || time === null || location.length === 0 || location === null) {
			alert('Please fill in a time and location for your study group!');
		}

		$.post('/api/joingroup/' + groupId + '/' + userId, userJoinGrp)
		.then(function() {
			console.log('Joined group!');
		});
	});

	$('#btn-search').on('click', function(event){
		event.preventDefault();

		let inputSearchTerm = $("#input-search-term").val().trim();
		console.log(inputSearchTerm);

		$.ajax("/api/search/" + inputSearchTerm, {
			type: "GET"
		}).then(
			function(result) {
				console.log("Got search results");
				window.location.replace('/api/search/' + inputSearchTerm);
			}
		);
	});
});
