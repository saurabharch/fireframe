app.config(function($stateProvider) {
	$stateProvider.state('project', {
		url: '/project/:id',
		templateUrl: '/js/project/project.html',
		controller: 'ProjectCtrl'
	});
});

app.controller('ProjectCtrl', function() {

});