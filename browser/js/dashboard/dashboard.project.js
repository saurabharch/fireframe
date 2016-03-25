app.config(function($stateProvider) {
	$stateProvider.state('dashboard.project', {
		url: '/project/:id',
		templateUrl: '/js/dashboard/dashboard.project.html',
		resolve: {
			project: function($stateParams, Project, Firebase) {
				var proj;
				return Project.fetchProject($stateParams.id)
				.then(project => {
					proj = project;
					return Firebase.checkForWireframes(project._id);
				})
				.then(wireframe =>{
					var edits = wireframe.val();
					proj.activeEdits = [];

					if (edits) {
						for(var session in edits) {
							proj.activeEdits.push(session);
						}
					}
					console.log("Active édits åre: ", proj.activeEdits);
				}).then(wireframe => proj);
			}
		},
		controller: 'ProjectCtrl'
	});
});

app.controller('ProjectCtrl', function($scope, $state, project, Wireframe) {
	$scope.project = project;
	console.log(project);
	$scope.history = [];
	$scope.altBranches = [];
	$scope.master = project.wireframes.filter(frame => frame.master === true)[0];
	$scope.active = $scope.master;

	traverseFrames($scope.active);
	console.log($scope.master);
	console.log($scope.history);
	console.log($scope.altBranches);

	$scope.forkFrame = function(){
		Wireframe.fork($scope.master._id, $scope.project._id)
		.then(wireframe=>{
			$state.go('editor', {id:wireframe._id, projectId:$scope.project._id});
		});
	};

	$scope.changeActive = function(frame){
		$scope.active = frame;
		console.log($scope.active);
		$scope.history = [];
		$scope.altBranches = [];
		traverseFrames($scope.active);
	};

	$scope.currentEdit = function(){
		return $scope.project.activeEdits.indexOf($scope.active._id) !== -1;
	};

	$scope.joinRoom = function(){
		$state.go('editor', {id:$scope.active._id, projectId: $scope.project._id});
	};

	//Fill out history and branches by traversing project frame tree
	function traverseFrames(frame) {
		//Find history
		if (frame.parent){
			var parent = $.grep($scope.project.wireframes, e => e._id === frame.parent)[0];
		}
		if(parent){
			$scope.history.push(parent);
			traverseFrames(parent);
		}
		$scope.altBranches = $.grep($scope.project.wireframes, e => !e.children.length && e !== $scope.active);
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