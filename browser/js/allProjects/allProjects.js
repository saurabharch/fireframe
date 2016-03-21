'use strict';

app.config(function($stateProvider) {
	$stateProvider.state('allProjects', {
		url: '/projects',
		templateUrl: '/js/allProjects/allProjects.html',
		controller: 'AllProjectsCtrl'
	})
});

app.controller('AllProjectsCtrl', function($scope) {

});