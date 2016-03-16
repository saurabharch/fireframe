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

app.controller('WireframeCtrl', function($scope, wireframe, $compile) { //ComponentFactory
	$scope.wireframe = wireframe;
	$scope.board = $('#wireframe-board');
	$scope.createElement = function(type) { //ComponentFactory.createElement
		var el = $compile('<base-layer></base-layer>')($scope).draggable().resizable({ containment: "#wireframe-board" });
  	$scope.board.append(el);
	}
});