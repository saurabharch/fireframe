'use strict';

app.config(function($stateProvider) {
	$stateProvider.state('user', {
		url: '/user/:id',
		templateUrl: '/js/user/user.html',
		controller: 'UserCtrl'
	})
});

app.controller('UserCtrl', function($scope) {
	$(document).ready(function() {
		$('.sidebar li').click(function() {
			$('.sidebar li').removeClass('active');
			$(this).addClass('active');
		});
	});
});