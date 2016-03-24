app.config(function($stateProvider) {
	$stateProvider.state('project', {
		url: '/project/:id',
		templateUrl: '/js/project/project.html',
		resolve: {
			project: function($stateParams, Project) {
				return Project.fetchProject($stateParams.id);
			}
		},
		controller: 'ProjectCtrl'
	});
});

app.controller('ProjectCtrl', function($scope, project) {
	$scope.project = project;
	$scope.history = [];
	$scope.altBranches = [];
	$scope.master = project.wireframes.filter(frame => frame.master = true);

	traverseFrames($scope.master);
	console.log($scope.history);
	console.log($scope.altBranches);
	//Fill out history and branches by traversing project frame tree
	function traverseFrames(frame) {
		//Find history
		if(frame.parent && $scope.history.indexOf(frame.parent) === -1){
			$scope.history.push(frame.parent);
			traverseFrames(frame.parent);
		}
		//Find alternate branches
		traverseDown(frame);

	}

	//Doesn't find history, only children in order to find branches
	function traverseDown(frame){
		if(frame.children.length){
			frame.children.forEach(function(child){
				if($scope.history.indexOf(child) === -1 && child !== $scope.master){
					traverseDown(child);
				}
			});
		} else $scope.altBranches.push(frame);
	}

});