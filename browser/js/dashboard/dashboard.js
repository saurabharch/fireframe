'use strict';

app.config(function($stateProvider) {
	$stateProvider.state('dashboard', {
		url: '/dashboard',
		templateUrl: '/js/dashboard/dashboard.html',
		controller: 'DashboardCtrl',
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
	})
});

app.controller('DashboardCtrl', function($scope, $state, user, $mdSidenav, $mdDialog) {
	$state.go('dashboard.allProjects');

	$scope.user = user;
	$scope.formShow = false;

	$('.sidebar li').click(function() {
		if($(this).find('a').hasClass('add')) return;
		$('.sidebar li').removeClass('active');
		$(this).addClass('active');
		$mdSidenav('left').toggle();
	});

	$scope.createProject = function(event) {
    $mdSidenav('left').toggle();
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
		var options = $mdDialog.show({
			parent: angular.element(document.querySelector('body')),
			templateUrl: '/js/dashboard/dashboard.new-project.html',
			targetEvent: event,
			clickOutsideToClose: true,
			controller: 'NewProjectCtrl'
		})
  };

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

		$scope.addProject = function(){
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
		};

		$scope.cancelTeam = function(){
			$scope.formShow = false;
		}
});