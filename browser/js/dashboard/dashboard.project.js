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
	$scope.altBranches = $.grep($scope.project.wireframes, e => !e.children.length && e !== $scope.active);
	traverseFrames($scope.active);

	$scope.forkFrame = function(){
		Wireframe.fork($scope.active._id, $scope.project._id)
		.then(wireframe=>{
			$state.go('editor', { id: wireframe._id, projectId: $scope.project._id });
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

	$scope.getProjDetails = function() {
		console.log("project details will go here", $scope.project.project);

	};

	$scope.changeActive = function(frame){
		$scope.active = frame;
		$scope.history = [];
		$scope.altBranches = [];
		traverseFrames($scope.active);
		$scope.altBranches = $.grep($scope.project.wireframes, e => !e.children.length && e !== $scope.active);
	};

	$scope.setMaster = function(){
		$scope.master = $scope.active;
		Wireframe.setMaster($scope.master._id, $scope.project._id);
	};

	$scope.joinRoom = function(){
		$state.go('editor', {id:$scope.active._id, projectId: $scope.project._id});
	};

	//Fill out history
	function traverseFrames(frame) {
		//Find history
		var parent;
		if (frame.parent){
			parent = $.grep($scope.project.wireframes, e => e._id === frame.parent)[0];
			$scope.history.push(parent);
			traverseFrames(parent);
		}
	}


	//Functions checking current scope status

	$scope.currentEdit = function(){
		return $scope.project.activeEdits.indexOf($scope.active._id) !== -1;
	};

	$scope.isMaster = function(){
		return $scope.active === $scope.master;
	};

	//date created, team name and members, team admin, brief description of project 

});
