app.config(function($stateProvider) {
	$stateProvider.state('wireframe', {
		url: '/wireframe/:id',
		templateUrl: '/js/wireframe/wireframe.html',
		resolve: {
			// wireframe: function($stateParams, WireframeFactory) {
			// 	return WireframeFactory.fetchById($stateParams.id);
			// }
			wireframe: function() {
				return { components: [], height: 150, master: true };
			}
		},
		controller: 'WireframeCtrl'
	})
});

app.controller('WireframeCtrl', function($scope, wireframe, $compile, Component, Interact) {
	$scope.wireframe = wireframe;
	$scope.board = $('#wireframe-board');

	Interact.dragAndResize();
	Interact.windowResize();

	$scope.loadElements = function() {
		Component.load(wireframe.components, $scope);
	}

	$scope.createElement = function(type) {
		Component.create('base-layer', $scope);
	}

});