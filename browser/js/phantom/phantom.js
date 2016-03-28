app.config(function($stateProvider) {
	$stateProvider.state('phantom', {
		url: '/phantom/:id',
		templateUrl: '/js/phantom/phantom.html',
		resolve: {
			wireframe: function($stateParams, Wireframe) {
				return Wireframe.fetchOne($stateParams.id)
			}
		},
		controller: 'PhantomCtrl'
	});
});

app.controller('PhantomCtrl', function($scope, wireframe, Component, CSS, Wireframe, $window) {
	$scope.wireframe = wireframe;
	$scope.board = $('.phantom-board');

	$scope.setStyle = function(style) {
		return style;
	}

	$scope.setSource = function(source) {
		return source;
	}

	//load components
	//Component.load($scope.wireframe.components, $scope);
	
	//update zoom to fit all elements
	var width = $(window).width();
	var projectWidth = $scope.board.prop('scrollWidth');
	var widthScale = width/projectWidth*100;

	var height = $(window).height();
	var projectHeight = $scope.board.prop('scrollHeight');
	var heightScale = height/projectHeight*100;

	var scale = (heightScale > widthScale) ? widthScale : heightScale;

	CSS.updateZoom(scale);
	$scope.board.width(width/scale*100);
	$('navbar').remove();

	window.callPhantom('takeShot');
});