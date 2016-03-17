app.factory('Component', function($compile) {
	return {
		create: function(type, $scope) {
			var newElement;
			switch(type) {
				case 'base-layer':
					newElement = $compile('<base-layer class="resize-drag" ng-click="getComponentAttrs()"></base-layer>')($scope);
					break;
				case 'box':
					newElement = $compile('<box></box>')($scope);
					break;
				case 'text-box':
					newElement = $compile('<text-box></text-box>')($scope);
					break;
				case 'image-box':
					newElement = $compile('<image-box></image-box>')($scope);
					break;
				case 'list':
					newElement = $compile('<list></list>')($scope);
					break;
				case 'table':
					newElement = $compile('<table-component></table-component>')($scope);
					break;
			}
  		$scope.board.append(newElement);
		},

		save: function($scope) {
			$('#wireframe-board').children().each(function() {
				console.log("this is THIS!", this);
				var allstyles = this.getAttribute("style");
				console.log(allstyles);
			});
		}

		// load: function(components, $scope) {
		// 	components.forEach(function() {
				
		// 	})
		// }
	}
});