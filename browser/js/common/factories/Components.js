app.factory('Component', function($compile) {
	var styles = ['width', 'height', 'z-index', 'opacity', 'border-size', 'border-style', 'border-color'];
	
	//ng-style couldn't handle commas in rgb(0,0,0) so added this instead
	function addCSS(element, styles) {
		//should also add an id in here?
		for(var prop in styles) {
			var param = {};
			param[prop] = styles[prop];
			$(element).css(param);
		}
	}

	var factory = {
		create: function(type, $scope, style) {
			var newElement;
			switch(type) {
				case 'base-layer':
					newElement = $compile('<base-layer ng-click="makeActive($event)" class="resize-drag"></base-layer>')($scope);
					break;
				case 'box':
					newElement = $compile('<box ng-click="makeActive($event)" class="resize-drag"></box>')($scope);
					break;
				case 'text-box':
					newElement = $compile('<text-box ng-click="makeActive($event)" class="resize-drag"></text-box>')($scope);
					break;
				case 'image-box':
					newElement = $compile('<image-box ng-click="makeActive($event)" class="resize-drag"></image-box>')($scope);
					break;
				case 'list':
					newElement = $compile('<list ng-click="makeActive($event)" class="resize-drag"></list>')($scope);
					break;
				case 'table':
					newElement = $compile('<table-component ng-click="makeActive($event)" class="resize-drag"></table-component>')($scope);
					break;
			}

			addCSS(newElement, style);
  		$scope.board.append(newElement);
  		// $('.resize-drag').each(function() {
  		// 	$(this).uniqueId();
  		// })
		},

		save: function() {
			var components = [];
			$('#wireframe-board').children().each(function() {
				var element = $(this);
				var component = {};
				component.type = element.prop('tagName').toLowerCase();
				component.style = {};

				styles.forEach(function(style) {
					if (element.css(style)) {
						component.style[style] = element.css(style);
					}
				});
				component.style.left = element.position().left;
				component.style.top = element.position().top;

				//this results in an array of object like this
				//styles: {
					// border-color: "rgb(0, 0, 0)"
					// border-style: "solid"
					// height: "400px"
					// left: 0
					// opacity: "1"
					// top: 0
					// width: "400px"
					// z-index: "auto"
				//},
				//type: "base-layer"

				//need send this array of components back to server (through wireframe factory?)
			});
		},

		load: function(components, $scope) {
			console.log(components);
			components.forEach(function(component) {
				factory.create(component.type, $scope, component.style);
			});
		}
	}

	return factory;
});