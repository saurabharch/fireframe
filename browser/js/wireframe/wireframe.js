//temporary components to check loading function
var comps = [
// {
// 	style: {
// 		"border-color": "'rgb(0, 0, 0)'",
// 		"border-style": "solid",
// 		height: "400px",
// 		left: 0,
// 		opacity: "1",
// 		top: 0,
// 		width: "400px",
// 		"z-index": "auto",
// 	}
// 	type: "base-layer"
// },
// {
// 	style: {
// 		"border-color": "rgb(0, 255, 0)",
// 		"border-style": "solid",
// 		height: "200px",
// 		left: '-50px',
// 		opacity: "1",
// 		top: '-25px',
// 		width: "1200px",
// 		"z-index": "auto",
// 	},
// 	type: "base-layer"
// },
// {
// 	style: {
// 		"border-color": "rgb(255, 0, 0)",
// 		"border-style": "solid",
// 		height: "100px",
// 		left: '345px',
// 		opacity: "1",
// 		top: '678px',
// 		width: "100px",
// 		"z-index": "auto",
// 	},
// 	type: "base-layer"
// },
]

app.config(function($stateProvider) {
	$stateProvider.state('wireframe', {
		url: '/wireframe/:id',
		templateUrl: '/js/wireframe/wireframe.html',
		resolve: {
			// wireframe: function($stateParams, WireframeFactory) {
			// 	return WireframeFactory.fetchById($stateParams.id);
			// }
			wireframe: function() {
				return { components: comps, master: true };
			}
		},
		controller: 'WireframeCtrl'
	})
});

app.controller('WireframeCtrl', function($scope, wireframe, $compile, Component, Interact, CSS) {
	$scope.wireframe = wireframe;
	$scope.components = wireframe.components;
	$scope.board = $('#wireframe-board');
	
	//load saved elements, if any
	Component.load($scope.components, $scope);

	//initialize dragging and resizing
	Interact.dragAndResize();

	//set current zoom and initialize CSS zoom
	$scope.currentZoom = CSS.currentZoom();
	$scope.updateZoom = CSS.updateZoom;

	$scope.containsBase = function() {
		return components.filter(function(component) {
			return component.type === 'base-layer';
		}).length;
	}

	$scope.saveElements = function() {
			Component.saveComponents();
	}

	$scope.createElement = function(type) {
		
		var newElement = Component.create(type, $scope);
		$scope.components.push(newElement);
		console.log(newElement);
		console.log($scope.components, "components");
	}

	$scope.deleteElement = function() {

	}

});










