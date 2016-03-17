app.directive('windowResponsive', function() {
	return {
		restrict: 'A',
		link: function(scope, element, attribute) {
			var referenceWidth = $('#left-sidebar').width();
			//all elements are sized as a % relative to the workspace width
			$(window).resize(function() {
				var	sidebar = $('#left-sidebar'),
						newWidth = sidebar.width(),
						percentChange = newWidth/referenceWidth;
				
				//adjust element width and height
				var oldWidth = $(element).width();
				var oldHeight = $(element).height();
				$(element).width(oldWidth*percentChange);
				$(element).height(oldHeight*percentChange);

				//var boardLeft = workspace.offset().left;
				// var boardTop = workspace.offset().top;

				// var boxLeft = $(element).offset().left;
				// var boxTop = $(element).offset().top;

				// var topOffset = boxTop - boardTop;
				// var newTopOffset = topOffset*percentChange;
				//console.log(topOffset, newTopOffset, percentChange);
				//$(element).offset({ top: newTopOffset-boxTop });
				// //find x distance from left edge, percentage change times that is new left offset
				// // console.log(percentChange);
				// console.log(boxLeft);
				// console.log(boardLeft);
				// var adjustment = (boxLeft-boardLeft)*percentChange;
				// // console.log(boardLeft, newLeft, percentChange);
				// // console.log($(element).position())

				// $(element).offset({ left: (boardLeft+adjustment) });

				referenceWidth = sidebar.width();
			});
		}
	}
});