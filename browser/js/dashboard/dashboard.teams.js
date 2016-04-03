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

	$scope.teams.forEach(function(team){
		team.screenshots = [];
		Team.fetchTeamProjects(team._id)
		.then(projects => {
			console.log(projects, "the projects for a team?");
			return team.projects = projects;
		})
		.then(function(projects) {
			projects.forEach(function(project, i) {
				var projinfo = {};
				projinfo.name = project.name;
				projinfo.screenshotUrl = projects[i].master.screenshotUrl;
				team.screenshots.push(projinfo);
				console.log(team.screenshots, "array of team proj screenshots");
			})
		})
	});
});
