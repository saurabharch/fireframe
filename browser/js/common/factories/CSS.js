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

		extractStyle: function(element) {
			var style = {};
			styles.forEach(function(prop) {
				style[prop] = element.css(prop);
			});
			var boardLeft = $('#wireframe-board').scrollLeft();
			var boardTop = $('#wireframe-board').scrollTop();

			style.left = element.position().left/currentScale*100+boardLeft*100/currentScale;
			style.top = element.position().top/currentScale*100+boardTop*100/currentScale;

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