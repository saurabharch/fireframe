app.config(function ($stateProvider) {
    $stateProvider.state('home', {
        url: '/',
        templateUrl: 'js/home/home.html',
        controller: 'HomeCtrl'
    });
});

app.controller('HomeCtrl', function ($scope, $state, User, Wireframe) {
  $scope.sampleProject = function () {
		var project = {
			name: 'sample_project'
		};

		User.sampleProject(project)
		.then(wireframe => {
			Wireframe.setWireframe(wireframe);
			$state.go('editor', { id: wireframe._id, projectId: wireframe.project });
		});
  }
});
