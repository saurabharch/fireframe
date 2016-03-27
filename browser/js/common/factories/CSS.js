app.factory('CSS', function() {
	var currentScale = 100;

	return {
		updateZoom: function(percent) {
			currentScale = percent || 100;
			var scale = currentScale/100;
			var board = $('#wireframe-board');

			board		
				.css('width', 100/scale+'%')
				.css('height', 100/scale+'%')
				.css('transform', 'scale('+ scale +')');
		},

		currentZoom: function() {
			return currentScale;
		},

		//ng-style couldn't handle commas in rgb(0,0,0) so added this instead
		addStyles: function(element, styles) {
			for(var prop in styles) {
				var param = {};

				//catch for images flying off board...
				if((prop==='left' || prop==='top') && +styles[prop] < 0) styles[prop] = 0;
				
				param[prop] = styles[prop];
				$(element).css(param);
			}
		},

		addSource: function(element, source) {
			source = source || '/images/placeholder.png'
			$('img').attr('src', source);
		},

		removeTransform: function(element, style) {
			element.css('transform', '');
			element.removeData('data-x').removeAttr('data-x');
			element.removeData('data-y').removeAttr('data-y');
		}
	}
});