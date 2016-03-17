app.factory('Component', function($compile) {
	var factory = {
		create: function(type, $scope, style) {
			var style = style || { "border-size": "2px", "border-style": "solid", "border-color": "black" };
			var newElement;
			switch(type) {
				case 'base-layer':
					newElement = $compile('<base-layer window-responsive class="resize-drag" ng-style='+JSON.stringify(style)+'></base-layer>')($scope);
					break;
				case 'box':
					newElement = $compile('<box window-responsive class="resize-drag" ng-style='+JSON.stringify(style)+'></box>')($scope);
					break;
				case 'text-box':
					newElement = $compile('<text-box window-responsive class="resize-drag" ng-style='+JSON.stringify(style)+'></text-box>')($scope);
					break;
				case 'image-box':
					newElement = $compile('<image-box window-responsive class="resize-drag" ng-style='+JSON.stringify(style)+'></image-box>')($scope);
					break;
				case 'list':
					newElement = $compile('<list window-responsive class="resize-drag" ng-style='+JSON.stringify(style)+'></list>')($scope);
					break;
				case 'table':
					newElement = $compile('<table-component window-responsive class="resize-drag" ng-style='+JSON.stringify(style)+'></table-component>')($scope);
					break;
			}
  		$scope.board.append(newElement);
		},

		load: function(components, $scope) {
			components.forEach(function(component) {
				factory.create(component.type, $scope, component.style);
			});
		}
	}

	return factory
});