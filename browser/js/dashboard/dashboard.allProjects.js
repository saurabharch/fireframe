'use strict';

app.config(function($stateProvider) {
	$stateProvider.state('dashboard.allProjects', {
		templateUrl: '/js/dashboard/dashboard.allProjects.html',
		resolve: {
			projects: function(User) {
				return User.fetchProjects()
			}
		},
		controller: 'AllProjectsCtrl'
	})
});

app.controller('AllProjectsCtrl', function($scope, projects) {
	$scope.projects = projects
});