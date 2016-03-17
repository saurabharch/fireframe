app.config(function($stateProvider) {
	$stateProvider.state('wireframe', {
		url: '/wireframe/:id',
		templateUrl: '/js/wireframe/wireframe.html',
		resolve: {
			// wireframe: function($stateParams, WireframeFactory) {
			// 	return WireframeFactory.fetchById($stateParams.id);
			// }
			wireframe: function() {
				return { components: [{ type: 'base-layer' }], height: 150, master: true };
			}
		},
		controller: 'WireframeCtrl'
	})
});

app.controller('WireframeCtrl', function($scope, wireframe, $compile, Component, Interact) {
	$scope.wireframe = wireframe;
	$scope.components = wireframe.components;
	$scope.board = $('#wireframe-board');
	
	//if initial page load, render wireframe components
	$scope.elementsRendered = $scope.elementsRendered || false;
	if(!$scope.elementsRendered) {
		Component.load($scope.wireframe.components, $scope);
	}

	Interact.dragAndResize();

	// $scope.containsBase = function() {
	// 	return components.filter(function(component) {
	// 		return component.type === 'base-layer';
	// 	}).length;
	// }

	$scope.loadElements = function() {
		Component.load(wireframe.components, $scope);
	}

	$scope.createElement = function(type) {
		Component.create(type, $scope);
	}

	$scope.deleteElement = function() {

	}

});