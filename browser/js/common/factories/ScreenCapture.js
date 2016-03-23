app.factory('Screen', function(CSS) {
	return {
		capture: function() {
			var board = $('#wireframe-board');

			html2canvas(board, { width: 4000, height: board.prop('scrollHeight') }).then(function(canvas){
				  console.log('we are inside:', canvas);
				  document.body.appendChild(canvas);
			}, function(err){
				console.log(err);
			});

		}
	}
});