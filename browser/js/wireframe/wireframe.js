app.config(function($stateProvider) {
	$stateProvider.state('wireframe', {
		url: '/wireframe/:id',
		templateUrl: '/js/wireframe/wireframe.html',
		resolve: {
			// wireframe: function($stateParams, WireframeFactory) {
			// 	return WireframeFactory.fetchById($stateParams.id);
			// }
			wireframe: function() {
				console.log("in state?!??!");
				return { components: [], height: 150, master: true };

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
	
	//load saved elements, if any
	Component.load($scope.wireframe.components, $scope);

	//initialize dragging and resizing
	Interact.dragAndResize();

	$scope.containsBase = function() {
		return components.filter(function(component) {
			return component.type === 'base-layer';
		}).length;
	}

	$scope.loadElements = function() {
		Component.load(wireframe.components, $scope);
	}

	$scope.saveElements = function() {
		console.log($scope.components.clientHeight, $scope.components.clientWidth, wireframe.components, "scope? wireframe components?");
		Component.save(wireframe.components, $scope);
	}

	$scope.createElement = function(type) {
		Component.create(type, $scope);
	}

	$scope.deleteElement = function() {

	}

});