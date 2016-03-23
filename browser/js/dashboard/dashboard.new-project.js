'use strict';

app.config(function($stateProvider) {
	$stateProvider.state('dashboard.newProject', {
		templateUrl: '/js/dashboard/dashboard.new-project.html',
		controller: 'NewProjectCtrl',
		resolve: {
			user: function(AuthService, User, $log) {
				var user;
				return AuthService.getLoggedInUser()
				.then(currentUser => {
					user = currentUser;
					return User.getUserTeams(user._id)
				})
				.then(teams => {
					user.teams = teams;
					return user;
				})
				.catch(function(err) {
					console.log(err);
					return user;
				})
			}
		}
	});
});

app.controller('NewProjectCtrl', function($scope, $state, user, User, Wireframe) {
		$scope.user = user;
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
			var name = $scope.teamName;
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
				name: $scope.projectName
			};
			project.team = $scope.projectTeam ? $scope.projectTeam._id : null; 

			User.addProject(project)
			.then(wireframe => {
				Wireframe.setWireframe(wireframe);
				$state.go('editor', { id: wireframe._id });
			});
		};

});