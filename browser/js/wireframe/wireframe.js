app.config(function($stateProvider) {
	$stateProvider.state('wireframe', {
		url: '/wireframe/:id',
		templateUrl: '/js/wireframe/wireframe.html',
		resolve: {
			// wireframe: function($stateParams, WireframeFactory) {
			// 	return WireframeFactory.fetchById($stateParams.id);
			// }
			wireframe: function() {
				return { components: [], height: 150, master: true };
			}
		},
		controller: 'WireframeCtrl'
	})
});

app.controller('WireframeCtrl', function($scope, wireframe, $compile) { //ComponentFactory
	$scope.wireframe = wireframe;
	$scope.board = $('#wireframe-board');
	$scope.createElement = function(type) { //ComponentFactory.createElement
		var el = $compile('<base-layer></base-layer>')($scope);
  		$scope.board.append(el);
	}


	interact('.resize-drag')
	  .draggable({
	    // enable inertial throwing
	    inertia: false,
	    // keep the element within the area of it's parent
	    restrict: {
	      restriction: "#wireframe-board",
	      endOnly: false,
	      elementRect: { top: 0, left: 0, bottom: 1, right: 1 }
	    },
	    // enable autoScroll
	    autoScroll: true,

	    // call this function on every dragmove event
	    onmove: dragMoveListener,
	    // call this function on every dragend event
	    onend: function (event) {
	      var textEl = event.target.querySelector('p');

	      textEl && (textEl.textContent =
	        'moved a distance of '
	        + (Math.sqrt(event.dx * event.dx +
	                     event.dy * event.dy)|0) + 'px');
	    }
	  })
	  .resizable({
	    preserveAspectRatio: false,
	    edges: { left: true, right: true, bottom: true, top: true }
	  })
	  .on('resizemove', function (event) {
	    var target = event.target,
	        x = (parseFloat(target.getAttribute('data-x')) || 0),
	        y = (parseFloat(target.getAttribute('data-y')) || 0);

	    // update the element's style
	    target.style.width  = event.rect.width + 'px';
	    target.style.height = event.rect.height + 'px';

	    // translate when resizing from top or left edges
	    x += event.deltaRect.left;
	    y += event.deltaRect.top;

	    target.style.webkitTransform = target.style.transform =
	        'translate(' + x + 'px,' + y + 'px)';

	    target.setAttribute('data-x', x);
	    target.setAttribute('data-y', y);
	    target.textContent = Math.round(event.rect.width) + '×' + Math.round(event.rect.height);
	  });

	 function dragMoveListener (event) {
    var target = event.target,
        // keep the dragged position in the data-x/data-y attributes
        x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx,
        y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform =
    target.style.transform =
      'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  // this is used later in the resizing and gesture demos
  window.dragMoveListener = dragMoveListener;




});