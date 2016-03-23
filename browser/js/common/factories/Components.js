app.factory('Component', function($compile, CSS) {
	var styles = ['width', 'height', 'z-index', 'opacity', 'border-size', 'border-style', 'border-color', 'background-color'];
	var factory = {
		create: function(type, $scope, style, id) {
			var newElement;
			switch(type) {
				case 'base-layer':
					newElement = $compile('<base-layer id="' + id + '" ng-click="makeActive($event)" class="resize-drag"></base-layer>')($scope);
					break;
				case 'circle':
					newElement = $compile('<circle id="' + id + '" ng-click="makeActive($event)" class="resize-drag"></circle>')($scope);
					break;
				case 'box':
					newElement = $compile('<box id="' + id + '" ng-click="makeActive($event)" class="resize-drag"></box>')($scope);
					break;
				case 'text-box':
					newElement = $compile('<text-box id="' + id + '" ng-click="makeActive($event)" class="resize-drag"></text-box>')($scope);
					break;
				case 'image-box':
					newElement = $compile('<image-box id="' + id + '" ng-click="makeActive($event)" class="resize-drag"></image-box>')($scope);
					break;
				case 'list':
					newElement = $compile('<list id="' + id + '" ng-click="makeActive($event)" class="resize-drag"></list>')($scope);
					break;
				case 'table-component':
					newElement = $compile('<table-component id="' + id + '" ng-click="makeActive($event)" class="resize-drag"></table-component>')($scope);
					break;
				case 'button-component':
					newElement = $compile('<button-component id="' + id + '" ng-click="makeActive($event)" class="resize-drag"></button-component>')($scope);
					break;
			}

			CSS.addStyles(newElement, style);
  		$scope.board.append(newElement);
		},

		update: function(id, style) {
			var element = $('#'+id);
			CSS.addStyles(element, style);
			CSS.removeTransform(element, style);
		},

		deleteComponent: function(id) {
			$('#'+id).remove();
		},

		saveComponents: function() {
			var components = [];
			$('#wireframe-board').children().each(function() {
				var element = $(this);
				components.push(factory.saveComponent(element))
			});
			
			//need send this array of components back to server (through wireframe factory?)
			return components;
		},

		saveComponent: function(element) {
			var component = {};
			component.type = element.prop('tagName').toLowerCase();
			component.style = {};
			//component.id = element.attr('id');
			//component.style = CSS.extractStyles(element);

			//STILL NEED TO SCALE WIDTH AND POSITION BASED ON CURRENT ZOOM

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
			return component;
		},

		load: function(components, $scope) {
			if (components) {
				components.forEach(function(component) {
					factory.create(component.type, $scope, component.style);
				});
			}
		}
	}

	return factory;
});