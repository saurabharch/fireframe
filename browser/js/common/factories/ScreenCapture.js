app.factory('Screen', function(CSS) {
	return {
		capture: function() {
			var board = $('#wireframe-board');
			//, { width: 4000, height: board.prop('scrollHeight') }
			html2canvas(board).then(function(canvas){
				console.log('we are inside:', canvas);
			  //document.body.appendChild(canvas);
			  return canvas;
			}, function(err){
				console.log(err);
			});
		}
	}
});