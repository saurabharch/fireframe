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
	$scope.activeColor = "#F00";
	$scope.elementsRendered = $scope.elementsRendered || false;
	

	if(!$scope.elementsRendered) {
		Component.load($scope.wireframe.components, $scope);
	}

	Interact.dragAndResize();

	$scope.loadElements = function() {
		Component.load(wireframe.components, $scope);
	};

	$scope.createElement = function(type) {
		var style = { "background-color":$scope.activeColor, "opacity":$scope.activeOpacity, "border-size": "2px", "border-style": "solid", "border-color": "black"};

		Component.create(type, $scope, style);
	};

	$scope.makeActive = function($event){
		console.log("in make active editor js");
		$scope.active = $event.target;
		$scope.activeColor = $scope.active.style.backgroundColor;
	};

	$scope.$watch('activeColor', function(){
		if($scope.active) $scope.active.style.backgroundColor = $scope.activeColor;
	});
});