app.factory('Screen', function(CSS) {
	return {
		capture: function() {
			console.log('Screen factory works');
			// CSS.updateZoom(50);
			html2canvas($('#wireframe-board'), {width: 7000}).then(function(canvas){
				  console.log('we are inside:', canvas);
				  document.body.appendChild(canvas);
			}, function(err){
				console.log(err);
			});

		}
	}
});