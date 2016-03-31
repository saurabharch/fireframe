app.factory('Interact', function(CSS) {
	//inject CSS to adjust movements to current scale
	var scale = function() {
		return CSS.currentZoom()/100
	};

	var snapPoints = function(mouseX, mouseY) {
		var el = $('#wireframe-board');
		var xLeft = el.offset().left;
		var xRight = el.position().left + el.width();
		var yTop = el.offset().top;
		var yBottom = el.position().top + el.height();

		var points = [{x: xLeft}, {y: yTop}]
		console.log(points);
		return points;
	}

	var currentEdges = [];

	setInterval(function(){ currentEdges.push({ x: 100*currentEdges.length, y: 100*currentEdges.length }) }, 2000)

	var interactions = {
		dragAndResize: function() {
			interact('.resize-drag')
			  .draggable({
			    inertia: false,
			    autoScroll: true,
			    onmove: dragMoveListener,
			    restrict: {
			      restriction: "#wireframe-board",
			      endOnly: true,
			      elementRect: { top: 0, left: 0, bottom: null, right: null }
			    },
			    snap: { targets: currentEdges, range: 30 }
			  })
			  .resizable({
			    preserveAspectRatio: false,
			    edges: { left: true, right: true, bottom: true, top: true },
			    restrict: {
			      restriction: "#wireframe-board",
			      endOnly: false,
			      elementRect: { top: 0, left: 0, bottom: '1000px', right: '1000px' }
			    }
			  })
			  // .preventDefault('never')
			  .styleCursor(true)
			  .on('resizemove', function (event) {
			    var target = event.target,
			        x = (parseFloat(target.getAttribute('data-x')) || 0),
			        y = (parseFloat(target.getAttribute('data-y')) || 0);

			    // update the element's style
			    target.style.width  = event.rect.width/scale() + 'px';
			    target.style.height = event.rect.height/scale() + 'px';

			    // translate when resizing from top or left edges
			    x += event.deltaRect.left/scale()//-$('#wireframe-board').scrollLeft()//scale();
			    y += event.deltaRect.top/scale()//-$('#wireframe-board').scrollTop()//scale()

			    target.style.webkitTransform = target.style.transform =
			        'translate(' + x + 'px,' + y + 'px)';

			    target.setAttribute('data-x', x);
			    target.setAttribute('data-y', y);
			  });

			  function dragMoveListener (event) {
		    	var target = event.target,
			  		originalPos = [target.getAttribute('data-x'),target.getAttribute('data-y')],
		        // keep the dragged position in the data-x/data-y attributes
		        x = ((parseFloat(target.getAttribute('data-x')) || 0) + event.dx/scale()),
		        y = ((parseFloat(target.getAttribute('data-y')) || 0) + event.dy/scale());

			    // translate the element
			    target.style.webkitTransform =
			    target.style.transform =
			      'translate(' + x + 'px, ' + y + 'px)';

			    // update the posiion attributes
			    target.setAttribute('data-x', x);
			    target.setAttribute('data-y', y);
			  }
		},

		preserveAspectRatio: function() {
			interact('.resize-drag')
				.resizable({
			    preserveAspectRatio: true
			  })
		},

		removeAspectRatio: function() {
			interact('.resize-drag')
				.resizable({
					preserveAspectRatio: false
				})
		}
	};

	return interactions;
});