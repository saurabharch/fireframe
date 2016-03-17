app.config(function($stateProvider){
	$stateProvider.state('editor', {
		url: '/editor',
		templateUrl: '/js/editor/editor.html',
		resolve: {
			wireframe: function() {
				return { components: [], master: true };
			}
		},
		controller: 'EditorCtrl'
		});
});

app.controller('EditorCtrl', function($scope, wireframe, $compile, Component, Interact) {
	$scope.wireframe = wireframe;
	$scope.board = $('#wireframe-board');
	$scope.active = null;
	$scope.elementsRendered = $scope.elementsRendered || false;

	if(!$scope.elementsRendered) {
		Component.load($scope.wireframe.components, $scope);
	}

	Interact.dragAndResize();

	$scope.loadElements = function() {
		Component.load(wireframe.components, $scope);
	};

	$scope.createElement = function(type) {
		Component.create(type, $scope);
	};

});