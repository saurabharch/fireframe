'use strict';

app.config(function($stateProvider) {
	$stateProvider.state('user', {
		url: '/user/:id',
		templateUrl: '/js/user/user.html',
		controller: 'UserCtrl'
	})
});

app.controller('UserCtrl', function($scope, $state) {

	$state.go('user.allProjects');

	$(document).ready(function() {

		$('.sidebar li').click(function() {
			if($(this).find('a').hasClass('add')) return;
			$('.sidebar li').removeClass('active');
			$(this).addClass('active');
		});

	});
});