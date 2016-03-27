app.directive('textBox', function($timeout) {
  return {
    restrict: 'E',
    templateUrl: '/js/common/directives/components/text-box/text-box.html',
    scope:true,
    link: function(scope, element) {

    	scope.text = element[0].getAttribute('data-textContents');
    	scope.$on('element-changed', changeText);

    	if(!scope.text) scope.text = "Text goes here!";
    	scope.$watch('text', function(){
    		element[0].setAttribute('data-textContents',scope.text);
    		console.log("changing element", element[0].getAttribute('data-textContents'));
    	});

	    function changeText(){
	    	$timeout(function(){
	    		scope.text = element[0].getAttribute('data-textContents');
	    	}, 1);
	    }
    }

  };
});