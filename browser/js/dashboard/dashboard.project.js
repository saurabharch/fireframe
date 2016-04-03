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
				.then(wireframes =>{
					proj.activeEdits = wireframes.map(w => w.key())
					return proj;
				})
			}
		},
		controller: 'ProjectCtrl'
	});
});

app.controller('ProjectCtrl', function($scope, $state, project, Wireframe, Project) {
	$scope.project = project;
	$scope.history = [];
	$scope.altBranches = [];
	$scope.master = project.wireframes.filter(frame => frame.master === true)[0];
	$scope.active = $scope.master;
	$scope.showHistory = false;
	$scope.altBranches = $.grep($scope.project.wireframes, e => !e.children.length && e !== $scope.active);
	traverseFrames($scope.active);
	$scope.active.screenshotUrl = $scope.active.screenshotUrl || 'http://qvartz.com/wp-content/uploads/2015/05/Image_placeholder_4-3.png';
	$scope.forkFrame = function(){
		Wireframe.fork($scope.active._id, $scope.project._id)
		.then(wireframe=>{
			$state.go('editor', { id: wireframe._id, projectId: $scope.project._id });
		});
	};

	$scope.goHistory = function(){
		$scope.showHistory = true;
	};

	$scope.goAlt = function(){
		$scope.showHistory = false;
	};

	$scope.changeActive = function(frame){
		$scope.active = frame;
		$scope.history = [];
		$scope.altBranches = [];
		traverseFrames($scope.active);
		$scope.altBranches = $.grep($scope.project.wireframes, e => !e.children.length && e !== $scope.active);
		$scope.active.screenshotUrl = $scope.active.screenshotUrl || 'http://qvartz.com/wp-content/uploads/2015/05/Image_placeholder_4-3.png';

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
		function traverse(frame) {
			var parent;
			if (frame.parent){
				parent = $.grep($scope.project.wireframes, e => e._id === frame.parent)[0];
				$scope.history.push(parent);
				traverse(parent);
			}
		}
		traverse(frame);
		$scope.history.reverse();
	}

	//Add comment to project
	$scope.addComment = function() {
		if($scope.newComment) {
			Project.submitComment($scope.project._id, $scope.newComment)
			.then(comment => {
				$scope.newComment = null;
				var comments = $scope.project.comments
				if (comments && comments.length) {
					comments.push(comment)
				} else {
					$scope.project.comments = [comment];
				}
			})
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
