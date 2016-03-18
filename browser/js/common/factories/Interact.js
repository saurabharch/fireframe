app.factory('Interact', function() {
	return {
		dragAndResize: function() {
			interact('.resize-drag')
			  .draggable({
			    inertia: false,
			    autoScroll: true,
			    onmove: dragMoveListener,
			    // restrict: {
			    //   restriction: "#wireframe-board",
			    //   endOnly: false,
			    //   elementRect: { top: 0, left: 0, bottom: null, right: null }
			    // },
			  })
			  .resizable({
			    preserveAspectRatio: false,
			    edges: { left: true, right: true, bottom: true, top: true },
			    // restrict: {
			    //   restriction: "#wireframe-board",
			    //   endOnly: false,
			    //   elementRect: { top: 0, left: 0, bottom: null, right: null }
			    // },
			  })
			  // .restrict({
			  // 	drag: "#wireframe-board",
			  // 	resize: '#wireframe-board'
			  // })
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
			    // target.textContent = Math.round(event.rect.width) + '×' + Math.round(event.rect.height);
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
		}
	}
});