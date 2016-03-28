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
	$scope.history = [];
	$scope.altBranches = [];
	$scope.master = project.wireframes.filter(frame => frame.master === true)[0];
	$scope.active = $scope.master;
	$scope.showHistory = true;

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

	$scope.goHistory = function(){
		$('#showAlt').removeClass("active");
		$scope.showHistory = true;
		$('#showHist').addClass("active");
	};

	$scope.goAlt = function(){
		$('#showHist').removeClass("active");
		$scope.showHistory = false;
		$('#showAlt').addClass("active");
	};

	$scope.changeActive = function(frame){
		console.log("fráme is: ",frame);
		$scope.active = $.grep($scope.project.wireframes, e=> e._id === frame);
		console.log($scope.active);
		$scope.history = [];
		$scope.altBranches = [];
		traverseFrames($scope.active);
	};

	$scope.setMaster = function(){
		$scope.master = $scope.active;
		Wireframe.setMaster($scope.master._id, $scope.project._id);
	};

	$scope.joinRoom = function(){
		$state.go('editor', {id:$scope.active._id, projectId: $scope.project._id});
	};

	//Fill out history and branches by traversing project frame tree
	function traverseFrames(frame) {
		//Find history
		var parent;
		if (frame.parent){
			parent = $.grep($scope.project.wireframes, e => e._id === frame.parent)[0];
		}
		if(parent){
			$scope.history.push(parent);
			traverseFrames(parent);
		}
		$scope.altBranches = $.grep($scope.project.wireframes, e => !e.children.length && e !== $scope.active);
	}


	//Functions checking current scope status

	$scope.currentEdit = function(){
		return $scope.project.activeEdits.indexOf($scope.active._id) !== -1;
	};

	$scope.isMaster = function(){
		return $scope.active === $scope.master;
	};

});