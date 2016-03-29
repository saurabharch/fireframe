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
	$scope.projects = projects;

	$scope.projects.forEach(project => {
		project.master = $.grep(project.wireframes, e => e.master === true)[0];
		console.log(project);
	});

	$(document).ready(function() {
		$('tr').on('mouseover', function(e) {
			$(this).toggleClass('active');
		});
	});
});