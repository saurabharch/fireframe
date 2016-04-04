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

app.controller('PhantomCtrl', function($scope, wireframe, CSS, Wireframe, $timeout) {
	$scope.wireframe = wireframe;
	$scope.board = $('#phantom-board');
	$('#main').css('background-color', 'white');

	$scope.setStyle = function(style) {
		return style;
	}

	$scope.setSource = function(source) {
		return source;
	}

	//timeout needed for scrollWidth to calculate properly
	$timeout(function() {
		//should also calculate left and rightmost elements, and adjust zoom and position to fit those, with some margin on either side

		//update zoom to fit all elements
		var width = $(window).width();
		var projectWidth = document.getElementsByTagName('body')[0].scrollWidth;
		var widthScale = width/projectWidth*100;

		var height = $(window).height();
		var projectHeight = $scope.board.prop('scrollHeight');
		var heightScale = height/projectHeight*100;

		var scale = (heightScale < widthScale) ? widthScale : heightScale;

		CSS.updateZoom(widthScale, true);
		$scope.board.width(width/scale*100);
		$('navbar').remove();
	}, 0)
});