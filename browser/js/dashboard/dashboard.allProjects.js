'use strict';

app.config(function($stateProvider) {
	$stateProvider.state('dashboard.allProjects', {
		templateUrl: '/js/dashboard/dashboard.allProjects.html',
		controller: 'AllProjectsCtrl'
	})
});

app.controller('AllProjectsCtrl', function($scope) {

});