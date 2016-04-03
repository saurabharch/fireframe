app.factory('CSS', function() {
	var styles = ['width', 'height', 'font-size', 'color', 'opacity', 'border-width', 'border-style', 'border-radius', 'border-color', 'background-color', 'background-image', 'background-size', 'z-index', 'text-align'];
	var currentScale = 100;

	return {
		updateZoom: function(percent, phantom) {
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

		extractStyle: function(element) {
			var style = {};
			styles.forEach(function(prop) {
				style[prop] = element.css(prop);
			});

			var boardLeft = $('#wireframe-board').scrollLeft();
			var boardTop = $('#wireframe-board').scrollTop();

			style.left = (element.position().left+boardLeft)*100/currentScale
			style.top = (element.position().top+boardTop)*100/currentScale
			return style;
		},

		removeTransform: function(id) {
			var element = $('#'+id);
			element.css('transform', '');
			element.removeData('data-x').removeAttr('data-x');
			element.removeData('data-y').removeAttr('data-y');
		}
	}
});