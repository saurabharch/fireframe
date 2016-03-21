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
	
	function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(arr) {
    return "#" + componentToHex(arr[0]) + componentToHex(arr[1]) + componentToHex(arr[2]);
	}

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
		var color = $scope.active.style.backgroundColor;
		color = color.substring(4, color.length-1);
		color = color.split(', ').map(str => Number(str));
		console.log(color);
		color = rgbToHex(color);
		$scope.activeColor = color;
	};

	$scope.$watch('activeColor', function(){
		if($scope.active) $scope.active.style.backgroundColor = $scope.activeColor;
	});
});