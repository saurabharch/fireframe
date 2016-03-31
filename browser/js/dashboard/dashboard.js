'use strict';

app.config(function($stateProvider) {
	$stateProvider.state('dashboard', {
		url: '/dashboard',
		templateUrl: '/js/dashboard/dashboard.html',
		controller: 'DashboardCtrl'
	})
});

app.controller('DashboardCtrl', function($scope, $state, $mdSidenav, $mdDialog) {

	$state.go('dashboard.allProjects');

	$('.sidebar li').click(function() {
		if($(this).find('a').hasClass('add')) return;
		$('.sidebar li').removeClass('active');
		$(this).addClass('active');
		$mdSidenav('left').toggle();
	});

	$scope.showAlert = function(ev) {
    $mdSidenav('left').toggle();
    // Appending dialog to document.body to cover sidenav in docs app
    // Modal dialogs should fully cover application
    // to prevent interaction outside of dialog
    // $mdDialog.show({
    // 	templateUrl: '/js/dashboard/dashboard.new-project.html',
    //   $mdDialog.alert()
    //     .parent(angular.element(document.querySelector('#popupContainer')))
    //     .clickOutsideToClose(true)
    //     .targetEvent(ev)
    // }
    // );
  };
});