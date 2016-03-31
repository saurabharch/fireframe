'use strict';

app.config(function($stateProvider) {
	$stateProvider.state('dashboard.teams', {
		templateUrl: '/js/dashboard/dashboard.teams.html',
		controller: 'UserTeamsCtrl',
		resolve: {
			userTeams: function(User, AuthService) {
				return AuthService.getLoggedInUser()
				.then(loggedUser => {
					return User.getUserTeams(loggedUser._id);
				})
				.then(teams => {
					return teams;
				});
			}	
		}
	})
});

app.controller('UserTeamsCtrl', function($scope, userTeams, Project, AuthService) {
	$scope.teams = userTeams;
	console.log("scope.teams is ",userTeams);
	console.log("user is ",AuthService.getLoggedInUser());
	$scope.teams.forEach(function(team){
		console.log("fetching teams???");
		var projectsTeam = Project.fetchProjectsByTeam({teamId: team._id});
		console.log(projectsTeam, "projects by team???");
	});



});