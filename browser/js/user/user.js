'use strict';

app.config(function($stateProvider) {
	$stateProvider.state('user', {
		url: '/user/:id',
		templateUrl: '/js/user/user.html',
		controller: 'UserCtrl'
	})
});

app.controller('UserCtrl', function($scope) {

});