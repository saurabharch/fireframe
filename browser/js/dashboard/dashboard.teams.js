'use strict';

app.config(function($stateProvider) {
	$stateProvider.state('dashboard.teams', {
		templateUrl: '/js/dashboard/dashboard.teams.html',
		controller: 'UserTeamsCtrl'
	})
});

app.controller('UserTeamsCtrl', function($scope) {

});