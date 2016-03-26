app.config(function($stateProvider){
	$stateProvider.state('editor', {
		url: '/editor/:projectId/edit/:id',
		templateUrl: '/js/editor/editor.html',
		resolve: {
			wireframe: function($stateParams, Wireframe, Firebase) {
				return Firebase.checkForComponents($stateParams.id, $stateParams.projectId)
				.then(components => {
					if (!components.val()) {
						return Wireframe.fetchOne($stateParams.id)
						.then(wireframe => {
							wireframe.project = $stateParams.projectId;
							return wireframe;
						})
					} else {
						return { _id: $stateParams.id, existing: true, project: $stateParams.projectId }
					}
				})
				.then(null, function(err){
					console.log(err);
				})
			},
			otherWireframe: function($stateParams, Wireframe, Firebase) {
				return Firebase.checkForComponents($stateParams.id, $stateParams.projectId)
				.then(components => {
					if (!components.val()) {
						return Wireframe.fetchOne($stateParams.id)
						.then(wireframe => {
							wireframe.project = $stateParams.projectId;
							return wireframe;
						})
					} else {
						return { _id: $stateParams.id, existing: true, project: $stateParams.projectId }
					}
				})
				.then(null, function(err){
					console.log(err);
				})
			}
		},
		controller: 'EditorCtrl'
		});
});

app.controller('EditorCtrl', function($scope, wireframe, otherWireframe, $compile, Component, Interact, CSS, Firebase, Wireframe) {
	$scope.wireframe = wireframe;
	$scope.otherWireframe = otherWireframe;
	$scope.board = $('#wireframe-board');

	$scope.wireframe.existing ? Firebase.joinRoom(wireframe, $scope) : Firebase.createRoom(wireframe, $scope);

	//$scope.components = wireframe.components;
	$scope.activeOpacity = 1;
	$scope.activeColor = "#FFF";
	$scope.elementsRendered = $scope.elementsRendered || false;

	//initialize dragging and resizing
	Interact.dragAndResize();

	//set current zoom and initialize CSS zoom
	$scope.currentZoom = CSS.currentZoom();
	$scope.updateZoom = CSS.updateZoom;
	

	// $scope.saveElements = function() {
	// 	Component.saveComponents();
	// };

	$scope.deleteElement = Firebase.deleteElement;


	$scope.createElement = function(type) {
		//var style = { "background-color":$scope.activeColor, "opacity":$scope.activeOpacity, "border-width": "1px", "border-style": "solid", "border-color": "gray"};
		var style = { "background-color": "#FFF", "opacity":$scope.activeOpacity, "border-width": "1px", "border-style": "solid", "border-color": "gray", "z-index": getZrange()};
		Firebase.createElement(style, type);
	};

	$scope.makeActive = function($event){
		$scope.active = $event.target;
		var color = $scope.active.style.backgroundColor;
		color = color.substring(4, color.length-1);
		color = color.split(', ').map(str => Number(str));
		color = rgbToHex(color);
		$scope.activeColor = color;
	};

	$scope.save = function () {
		Wireframe.save($scope.wireframe)
	};


	//Z-index arrangement

	$scope.moveForward = function(){
		if(!$scope.active) return;
		var zIndex = getZindex($scope.active);

		getElementArray().forEach(el => {
			let elZ = getZindex(el);
			if(elZ === zIndex + 1) el.style['z-index'] = elZ - 1;
		});

		if(zIndex > getMaxZ()) return;
		zIndex = zIndex + 1;
		$scope.active.style['z-index'] = zIndex;
	};

	$scope.moveBackward = function(){
		if (!$scope.active) return;
		var zIndex = getZindex($scope.active);

		getElementArray().forEach(el => {
			let elZ = getZindex(el);
			if(elZ === zIndex - 1) el.style['z-index'] = elZ + 1;
		});

		if(zIndex === 0) return;
		zIndex = zIndex - 1;
		$scope.active.style['z-index'] = zIndex;
	};

	$scope.moveToFront = function(){
		if(!$scope.active) return;
		var zIndex = getZindex($scope.active);
		var max = getMaxZ();
		getElementArray().forEach(el => {
			let elZ = getZindex(el);
			if(elZ > zIndex) el.style['z-index'] = elZ - 1;
		});

		zIndex = max;
		$scope.active.style['z-index'] = zIndex;
	};
	$scope.moveToBack = function(){
		if (!$scope.active) return;
		var zIndex = getZindex($scope.active);

		getElementArray().forEach(el => {
			let elZ = getZindex(el);
			if(elZ < zIndex) el.style['z-index'] = elZ + 1;
		});

		zIndex = 0;
		$scope.active.style['z-index'] = zIndex;
	};


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

	function getElementArray(){
		return [].slice.call($scope.board.children());
	}

	function getZindex(el){
		return Number(el.style['z-index']);
	}

	function getMaxZ(){
		var maxZ = 0;
		var elementArray = getElementArray();
		elementArray.forEach(el => {
			let z = getZindex(el);
			if(z > maxZ) maxZ = z;
		});
		return maxZ;
	}

	function getZrange(){
		var elementArray = getElementArray();
		return elementArray.length;
	}

	function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(arr) {
    return "#" + componentToHex(arr[0]) + componentToHex(arr[1]) + componentToHex(arr[2]);
	}

});