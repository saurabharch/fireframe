app.directive('imageBox', function() {
  return {
    restrict: 'E',
    templateUrl: '/js/common/directives/components/image-box/image-box.html',
    link: function(scope, element, attr) {
    	scope.getSource = function() {
    		return attr.src
    	}
    }

  }
});