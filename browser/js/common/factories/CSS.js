app.factory('CSS', function() {
	var styles = ['width', 'height', 'z-index', 'opacity', 'border-width', 'border-style', 'border-color', 'background-color', 'z-index'];
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
		},

		extractStyle: function(element) {
			var style = {};
			styles.forEach(function(prop) {
				style[prop] = element.css(prop);
			});
			style.left = element.position().left;
			style.top = element.position().top;
			return style;
		},

		extractSource: function(element) {
			return element.attr('src');
		},

		removeTransform: function(id) {
			var element = $('#'+id);
			element.css('transform', '');
			element.removeData('data-x').removeAttr('data-x');
			element.removeData('data-y').removeAttr('data-y');
		}
	}
});