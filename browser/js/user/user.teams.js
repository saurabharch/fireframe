'use strict';

app.config(function($stateProvider) {
	$stateProvider.state('user.teams', {
		templateUrl: '/js/user/user.teams.html',
		controller: 'UserTeamsCtrl'
	})
});

app.controller('UserTeamsCtrl', function($scope) {

});