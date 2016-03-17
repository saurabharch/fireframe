app.directive('baseLayer', function() {
	return {
		restrict: 'E',
		templateUrl: '/js/common/directives/components/base-layer/base-layer.html',
    scope: "=",
    link: function(scope, element, attr) {
      scope.getComponentAttrs = function() {
        scope.components = element[0];
        console.log(element[0], "component data");
      }

    }
	}
});