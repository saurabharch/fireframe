'use strict';

app.config(function($stateProvider) {
	$stateProvider.state('user.allProjects', {
		templateUrl: '/js/user/user.allProjects.html',
		controller: 'AllProjectsCtrl'
	})
});

app.controller('AllProjectsCtrl', function($scope) {

});