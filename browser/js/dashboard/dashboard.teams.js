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

app.controller('UserTeamsCtrl', function($scope, userTeams, Project, Team, AuthService) {
	$scope.teams = userTeams;
	console.log("scope.teams is ",userTeams);
	console.log("user is ",AuthService.getLoggedInUser());

	$scope.screenshots = [];
	$scope.teams.forEach(function(team){
		Team.fetchTeamProjects(team._id)
		.then(projects => {
			return team.projects = projects;
		})
		.then(function(projects) {
			projects.forEach(function(project, i) {
				$scope.screenshots.push(projects[i].master.screenshotUrl);
			})
		})
	});
});
