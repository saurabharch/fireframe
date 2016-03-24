'use strict';

app.config(function($stateProvider) {
	$stateProvider.state('dashboard.teams', {
		templateUrl: '/js/dashboard/dashboard.teams.html',
		controller: 'UserTeamsCtrl',
		resolve: {
			userTeams: function(User, AuthService) {
				return AuthService.getLoggedInUser()
				.then(function(loggedUser){
					return User.getUserTeams(loggedUser._id);
				});
			}
		}
	})
});

app.controller('UserTeamsCtrl', function($scope, userTeams) {
	$scope.teams = userTeams;
});