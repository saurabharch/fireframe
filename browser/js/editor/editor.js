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

function rgbToHex(r, g, b) {
    return "#" + ((1 << 24) + (r << 16) + (g << 8) + b).toString(16).slice(1);
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
		$scope.active = $event.target;
		var color = $scope.active.style.backgroundColor.split("(");
		color = color[1].split(',');
		color = [color[0],color[1].substring(1),color[2].substring(1,2)];
		color = rgbToHex(color[0],color[1],color[2]);
		$scope.activeColor = color;
	};

	$scope.$watch('activeColor', function(){
		if($scope.active) $scope.active.style.backgroundColor = $scope.activeColor;
	});
});