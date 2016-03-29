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
				})
				.then(function(teams){
					console.log(teams);
					return teams;
				});
			}
		}
	})
});

app.controller('UserTeamsCtrl', function($scope, userTeams, AuthService) {
	$scope.teams = userTeams;
	console.log("scope.teams is ",userTeams);
	console.log("user is ",AuthService.getLoggedInUser());
});