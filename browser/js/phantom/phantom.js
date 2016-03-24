app.config(function($stateProvider) {
	$stateProvider.state('phantom', {
		url: '/phantom/:id',
		template: '<div class="container"><div id="wireframe-board" class="phantom-board"></div><div>',
		resolve: {
			wireframe: function($stateParams, Wireframe) {
				return Wireframe.fetchOne($stateParams.id)
			}
		},
		controller: 'PhantomCtrl'
	});
});

app.controller('PhantomCtrl', function($scope, wireframe, Component, CSS, Wireframe) {
	$scope.wireframe = wireframe;
	$scope.board = $('.phantom-board');

	//load components
	Component.load($scope.wireframe.components, $scope);
	
	//update zoom to fit all elements
	var width = $(window).width();
	var projectWidth = $scope.board.prop('scrollWidth')+50;
	var widthScale = width/projectWidth*100;

	var height = $(window).height();
	var projectHeight = $scope.board.prop('scrollHeight')+50;
	var heightScale = height/projectHeight*100;

	var scale = (heightScale > widthScale) ? widthScale : heightScale;

	CSS.updateZoom(scale);
	$scope.board.width(width/scale*100);
	$('navbar').remove();
});