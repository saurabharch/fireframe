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

				var boardLeft = workspace.offset().left;
				// // var boardTop = workspace.offset().top;

				// var boxLeft = $(element).offset().left
				// //find x distance from left edge, percentage change times that is new left offset
				// // console.log(percentChange);
				// console.log(boxLeft);
				// console.log(boardLeft);
				// var adjustment = (boxLeft-boardLeft)*percentChange;
				// // console.log(boardLeft, newLeft, percentChange);
				// // console.log($(element).position())

				// $(element).offset({ left: (boardLeft+adjustment) });

				if($(element).offset().left+$(element).width()>=(boardLeft+originalWidth)) {
					console.log('34');
				}
			});
		}
	}
});