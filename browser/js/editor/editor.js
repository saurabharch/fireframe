app.config(function($stateProvider){
	$stateProvider.state('editor', {
		url: '/editor/:id',
		templateUrl: '/js/editor/editor.html',
		resolve: {
			// wireframe: function(Wireframe){
			// 	return Wireframe.getWireframe();
			// }
			wireframe: function($stateParams, Wireframe) {
				console.log($stateParams);
				return Wireframe.fetchOne($stateParams.id)
			}
		},
		controller: 'EditorCtrl'
		});
});

app.controller('EditorCtrl', function($scope, wireframe, $compile, Component, Interact, CSS, Firebase, Screen, Wireframe) {
	var newFork = true;
	//check if project create or project join
	newFork ? Firebase.createRoom(wireframe, $scope) : Firebase.joinRoom(wireframe, $scope);

	$scope.wireframe = wireframe;
	//$scope.components = wireframe.components;
	$scope.board = $('#wireframe-board');
	$scope.activeOpacity = 1;
	$scope.activeColor = "#F00";
	$scope.elementsRendered = $scope.elementsRendered || false;

	//load saved elements, if any
	Component.load($scope.components, $scope);

	//initialize dragging and resizing
	Interact.dragAndResize();

	//set current zoom and initialize CSS zoom
	$scope.currentZoom = CSS.currentZoom();
	$scope.updateZoom = CSS.updateZoom;
	

	$scope.saveElements = function() {
		Component.saveComponents();
	};

	$scope.deleteElement = Firebase.deleteElement;


	$scope.createElement = function(type) {
		//var style = { "background-color":$scope.activeColor, "opacity":$scope.activeOpacity, "border-width": "1px", "border-style": "solid", "border-color": "gray"};
		var style = { "background-color": "white", "opacity":$scope.activeOpacity, "border-width": "1px", "border-style": "solid", "border-color": "gray"};
		Firebase.createElement(style, type);
	};

	$scope.makeActive = function($event){
		$scope.active = $event.target;
		var color = $scope.active.style.backgroundColor;
		color = color.substring(4, color.length-1);
		color = color.split(', ').map(str => Number(str));
		color = rgbToHex(color);
		$scope.activeColor = color;
		$($scope.active).addClass('active-element');
	};

	//Z-index arrangement

	$scope.moveForward = function(){
		if(!$scope.active) return;

		var zIndex = $scope.active.style['z-index'];
		zIndex = Number(zIndex) + 1;
		$scope.active.style['z-index'] = zIndex;
	};

	$scope.moveBackward = function(){
		if (!$scope.active) return;

		var zIndex = $scope.active.style['z-index'];
		zIndex = Number(zIndex) + 1;
		$scope.active.style['z-index'] = zIndex;
	};

	$scope.moveToFront = function(){};
	$scope.moveToBack = function(){};


//Event listeners

	$scope.board.on('mousedown',function(){
		$($scope.active).removeClass('active-element');
		$scope.active = null;
		// $scope.createSelectBox;
	});

	$scope.$watch('activeColor', function(){
		if($scope.active) $scope.active.style.backgroundColor = $scope.activeColor;
	});


//Helper functions

	$scope.save = function () {
		Wireframe.save($scope.wireframe)
	};

	function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(arr) {
    return "#" + componentToHex(arr[0]) + componentToHex(arr[1]) + componentToHex(arr[2]);
	}

});