app.factory('Component', function($compile, CSS) {
	var styles = ['width', 'height', 'z-index', 'opacity', 'border-width', 'border-style', 'border-color', 'background-color', 'z-index'];
	var datatypes = ['textContents'];

	var factory = {

		create: function(type, $scope, style, id, dataset) {
// =======
// 		create: function(type, $scope, style, id, source) {
// >>>>>>> 825d56e7b2f4ef57e4d8baed36e7453f4f2a14f4
			var newElement;
			switch(type) {
				case 'base-layer':
					newElement = $compile('<base-layer id="' + id + '" ng-click="makeActive($event)" class="resize-drag component"></base-layer>')($scope);
					break;
				case 'circle':
					newElement = $compile('<circle id="' + id + '" ng-click="makeActive($event)" class="resize-drag component"></circle>')($scope);
					break;
				case 'box':
					newElement = $compile('<box id="' + id + '" ng-click="makeActive($event)" class="resize-drag component"></box>')($scope);
					break;
				case 'text-box':
					newElement = $compile('<text-box id="' + id + '" ng-click="makeActive($event)" class="resize-drag component"></text-box>')($scope);
					break;
				case 'image-box':
					newElement = $compile('<image-box id="' + id + '" ng-click="makeActive($event)" class="resize-drag component"></image-box>')($scope);
					break;
				case 'list':
					newElement = $compile('<list id="' + id + '" ng-click="makeActive($event)" class="resize-drag component"></list>')($scope);
					break;
				case 'table-component':
					newElement = $compile('<table-component id="' + id + '" ng-click="makeActive($event)" class="resize-drag component"></table-component>')($scope);
					break;
				case 'button-component':
					newElement = $compile('<button-component id="' + id + '" ng-click="makeActive($event)" class="resize-drag component"></button-component>')($scope);
					break;
			}

// <<<<<<< HEAD
			CSS.addStyles(newElement, style);
			newElement[0].setAttribute('data-textContents',dataset.textContents);
  		$scope.board.append(newElement);
		},

		update: function(id, style, dataset) {
// =======
// 			CSS.addStyles(newElement, style, source);
//   		$scope.board.append(newElement);
// 		},

// 		update: function(id, style, source) {
// >>>>>>> 825d56e7b2f4ef57e4d8baed36e7453f4f2a14f4
			var element = $('#'+id);
			CSS.addStyles(element, style);
			CSS.removeTransform(element, style);

			for(var key in dataset){
				element[0].setAttribute('data-'+key, dataset[key]);
			}
			console.log("finalleee ",element);

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
			
			return components;
		},

		saveComponent: function(element) {
			var component = {};
			component.type = element.prop('tagName').toLowerCase();
			component.style = {};
			component.dataset = {};
			component.id = element.attr('id');
			//component.style = CSS.extractStyles(element);

			//STILL NEED TO SCALE WIDTH AND POSITION BASED ON CURRENT ZOOM

			styles.forEach(function(style) {
				if (element.css(style)) {
					component.style[style] = element.css(style);
				}
			});

			datatypes.forEach(function(datatype) {
				if(element[0].getAttribute('data-'+datatype)){
					component.dataset[datatype] = element[0].getAttribute('data-'+datatype);
				}
			});

			component.style.left = element.position().left;
			component.style.top = element.position().top;

			return component;
		},

		load: function(components, $scope) {
			if (components) {
				components.forEach(function(component) {
					factory.create(component.type, $scope, component.style, null, component.source);
				});
			}
		},

		// uploadImage: function(image) {
		// 	$http.post('/api/upload', image)
		// 	.then(image => {

		// 	});
		// }
	}

	return factory;
});