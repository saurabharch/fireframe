'use strict';

app.controller('ModalInstanceCtrl', ["$uibModalInstance", "$scope", "$state", "user", "User", "Wireframe", "$timeout", function ($uibModalInstance, $scope, $state, user, User, Wireframe, $timeout) {
	$scope.user = user;
	$scope.formShow = false;
	//Add New Team
	$scope.teamMembers = [];

  $scope.addProject = function () {
		var project = {
			name: $scope.projectName,
			description: $scope.projectDescription
		};
		project.team = $scope.projectTeam ? $scope.projectTeam._id : null; 

		User.addProject(project)
		.then(wireframe => {
			Wireframe.setWireframe(wireframe);
			$state.go('editor', { id: wireframe._id, projectId: wireframe.project });
		});

    $uibModalInstance.close();
  };

  $scope.cancel = function () {
    $uibModalInstance.dismiss('cancel');
  };

	$scope.showTeamAdd = function(){
		$scope.formShow = true;
	};

	$scope.addMember = function(){
		$scope.teamMembers.push($scope.member);
		$scope.member = null;
	};

	$scope.addTeam = function(){
		var name = $scope.teamName;
		var admin = $scope.user._id;
		var members = $scope.teamMembers;
		if(!(name && members)) throw new Error('Fill out the form!');

		var team = {
			administrator: admin,
			name: name,
			members: members
		};

		User.addTeam(team)
		.then(team => {
			$scope.user.teams.push(team);
			$scope.formShow = false;
			$scope.projectTeam = team;
		});
	};

//Add New Project

	$scope.cancelTeam = function(){
		$scope.formShow = false;
	}
}]);