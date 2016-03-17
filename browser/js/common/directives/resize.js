app.directive('windowResponsive', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attribute) {
			var originalWidth = $('#wireframe-board').width();
			//all elements are sized as a % relative to the workspace width
			$(window).resize(function() {
				var	workspace = $('#wireframe-board'),
						newWidth = workspace.width(),
						percentChange = newWidth/originalWidth;
				//adjust element width and height
				var oldWidth = $(element).width();
				var oldHeight = $(element).height();
				$(element).width(oldWidth*percentChange);
				$(element).height(oldHeight*percentChange);
				originalWidth = workspace.width();

				//adjust x and y positioning as well
				//how???
			});
		}
	}
});