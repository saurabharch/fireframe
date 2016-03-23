'use strict';

app.config(function($stateProvider) {
	$stateProvider.state('user.newProject', {
		templateUrl: '/js/user/user.new-project.html',
		controller: 'NewProjectCtrl'
	});
});

app.controller('NewProjectCtrl', function($scope, $state, AuthService, User, Wireframe) {

		$scope.user = AuthService.getLoggedInUser();
		$scope.user.teams = User.getUserTeams($scope.user._id);
		$scope.formShow = false;

	//Add New Team
		$scope.teamMembers = [];

		$scope.showTeamAdd = function(){
			$scope.formShow = true;
		};

		$scope.addMember = function(){
			$scope.teamMembers.push($scope.member);
			$scope.member = null;
		};

		$scope.addTeam = function(){
			var name = $('#teamName');
			var admin = $scope.user._id;
			var members = $scope.teamMembers;
			if(!(name && members)) throw new Error('Fill out the form!');

			var team = {
				administrator:admin,
				name: name,
				members: members
			};

			User.addTeam(team)
			.then(team => {
				$scope.user.teams.push(team);
				$scope.formShow = false;
			});
		};

	//Add New Project

		$scope.addProject = function(){	
			var project = {
				name: $scope.projectName,
				team: $scope.team
			};

			User.addProject(project)
			.then(wireframe => {
				$state.go('editor', {id:wireframe._id});
				Wireframe.setWireframe(wireframe);
			});
		};

});