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

app.controller('DashboardCtrl', ["$scope", "$state", "$uibModal", function($scope, $state, $uibModal) {

	$('.sidebar li').click(function() {
		if($(this).find('a').hasClass('add')) return;
		$('.sidebar li').removeClass('active');
		$(this).addClass('active');
	});

	$scope.newProject = function () {
    var modalInstance = $uibModal.open({
      templateUrl: '/js/dashboard/dashboard.new-project.html',
      controller: 'ModalInstanceCtrl',
      size: 'sm',
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
  };

}]);