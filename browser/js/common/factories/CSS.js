app.factory('CSS', function() {
	var currentScale = 100;

	return {
		updateZoom: function(percent) {
			currentScale = percent || 100;
			var scale = currentScale/100;
			var board = $('#wireframe-board');

			board		
				.css('width', 80/scale+'%')
				.css('height', 100/scale+'%')
				.css('transform', 'scale('+ scale +')');
		},

		currentZoom: function() {
			return currentScale;
		},

		//ng-style couldn't handle commas in rgb(0,0,0) so added this instead
		addStyles: function(element, styles) {
			//should also add an id in here?
			for(var prop in styles) {
				var param = {};
				param[prop] = styles[prop];
				$(element).css(param);
			}
		}
	}
});