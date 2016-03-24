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

app.controller('ProjectCtrl', function($scope, project, Wireframe) {
	$scope.project = project;
	console.log(project);
	$scope.history = [];
	$scope.altBranches = [];
	$scope.master = project.wireframes.filter(frame => frame.master === true)[0];


	traverseFrames($scope.master);
	console.log($scope.master);
	console.log($scope.history);
	console.log($scope.altBranches);

	$scope.forkFrame = function(){
		Wireframe.fork($scope.master._id, $scope.project._id);
	};



	//Fill out history and branches by traversing project frame tree
	function traverseFrames(frame) {
		//Find history
		var parent = $.grep($scope.project.wireframes, e => e._id === frame.parent)[0];
		if(parent){
			$scope.history.push(parent);
			traverseFrames(parent);
		}
		$scope.altBranches = $.grep($scope.project.wireframes, e => !e.children.length && e != $scope.master);
	}


	// 	//Find alternate branches
	// 		traverseDown(frame);

	// }

	// //Doesn't find history, only children in order to find branches
	// function traverseDown(frame){
	// 	console.log("traversing down ", frame);
	// 	if(frame.children){
	// 		frame.children.forEach(function(childId){
	// 			console.log("childId is ", childId);
	// 			let child = $.grep($scope.project.wireframes, e => e._id = childId)[0];
	// 			console.log("child is ", child);
	// 			if(childId != $scope.master._id){
	// 				console.log("Going deeper, sir!");
	// 				traverseDown(child);
	// 			}
	// 		});
	// 	} else if(frame !== $scope.master) {
	// 		console.log("adding alt Branch, captain!");
	// 		$scope.altBranches.push(frame);
	// 	}
	// }

});