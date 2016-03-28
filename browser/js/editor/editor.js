app.config(function($stateProvider){
	$stateProvider.state('editor', {
		url: '/editor/:projectId/edit/:id',
		templateUrl: '/js/editor/editor.html',
		resolve: {
			wireframe: function($stateParams) {
				return { _id: $stateParams.id, project: $stateParams.projectId }
			},
			components: function($stateParams, Wireframe, Firebase) {
				return Firebase.fetchComponents($stateParams.id, $stateParams.projectId)
			}
		},
		controller: 'EditorCtrl'
		});
});

app.controller('EditorCtrl', function($scope, wireframe, components, Interact, CSS, Firebase, Wireframe, $rootScope) {
	console.log('does this work?');
	$scope.components = Firebase.getComponentCache();
	$scope.wireframe = wireframe;
	$scope.board = $('#wireframe-board');
	Firebase.setScope($scope);

	$scope.activeOpacity = 1;
	$scope.activeColor = "#FFF";

	//initialize dragging and resizing
	Interact.dragAndResize();

	//set current zoom and initialize CSS zoom
	$scope.currentZoom = CSS.currentZoom();
	$scope.updateZoom = CSS.updateZoom;

	$scope.deleteElement = Firebase.deleteElement;

	$scope.createElement = function(type) {
		var style = { "background-color": "#FFF", "opacity":$scope.activeOpacity, "z-index": getZrange()};
		Firebase.createElement({ style: style, type: type, content: 'I AM A TEXT BOX' });
	};
	
	$scope.setStyle = function(style) {
		return style;
	}

	$scope.setSource = function(source) {
		return source;
	}

	$scope.setActive = function(component) {
		$scope.active = component;
	}

	$scope.save = function () {
		Wireframe.save($scope.wireframe, $scope.components);
	};

	// $scope.imageUpload = function(element) {
	//   var file = element.files[0];
	//   var reader  = new FileReader();
	//   var name = Math.round(Math.random()*100000);

	//   //on upload, must create element on firebase
	//   //once that element is rendered on our page, we read the file as a data url and set the src to that..not updating firebase
	//   //but also need to leave src as default placeholder on all other users pages
	//   //at the same time, or perhaps once that firebase object is returned and we have its id, we need to upload the buffer to our server
	//   //send that to aws and get back a url
	//   //once we have the url, connect from the server to our firebase room, find that component by its id, and set the src to the image src passed in

	//   reader.addEventListener("load", function () {
	//     $('img').attr('src', reader.result);
	//     Component.uploadImage(reader.result)
	//   }, false);

	//   if (file) {
	//     reader.readAsDataURL(file);
	//   }
	// };

	//Z-index arrangement

	$scope.moveForward = function(){
		if(!$scope.active) return;
		var zIndex = getZindex($scope.active);

		getElementArray().forEach(el => {
			let elZ = getZindex(el);
			if(elZ === zIndex + 1) el.style['z-index'] = elZ - 1;
		});

		if(zIndex > getMaxZ()) return;
		zIndex = zIndex + 1;
		$scope.active.style['z-index'] = zIndex;
	};

	$scope.moveBackward = function(){
		if (!$scope.active) return;
		var zIndex = getZindex($scope.active);

		getElementArray().forEach(el => {
			let elZ = getZindex(el);
			if(elZ === zIndex - 1) el.style['z-index'] = elZ + 1;
		});

		if(zIndex === 0) return;
		zIndex = zIndex - 1;
		$scope.active.style['z-index'] = zIndex;
	};

	$scope.moveToFront = function(){
		if(!$scope.active) return;
		var zIndex = getZindex($scope.active);
		var max = getMaxZ();
		getElementArray().forEach(el => {
			let elZ = getZindex(el);
			if(elZ > zIndex) el.style['z-index'] = elZ - 1;
		});

		zIndex = max;
		$scope.active.style['z-index'] = zIndex;
	};

	$scope.moveToBack = function(){
		if (!$scope.active) return;
		var zIndex = getZindex($scope.active);

		getElementArray().forEach(el => {
			let elZ = getZindex(el);
			if(elZ < zIndex) el.style['z-index'] = elZ + 1;
		});

		zIndex = 0;
		$scope.active.style['z-index'] = zIndex;
	};


//Event listeners

	$scope.board.on('mousedown',function(){
		$scope.active = null;
	});

//Helper functions

	function getElementArray(){
		return [].slice.call($scope.board.children());
	}

	function getZindex(el){
		return Number(el.style['z-index']);
	}

	function getMaxZ(){
		var maxZ = 0;
		var elementArray = getElementArray();
		elementArray.forEach(el => {
			let z = getZindex(el);
			if(z > maxZ) maxZ = z;
		});
		return maxZ;
	}

	function getZrange(){
		var elementArray = getElementArray();
		return elementArray.length;
	}

	function componentToHex(c) {
    var hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
	}

	function rgbToHex(arr) {
    return "#" + componentToHex(arr[0]) + componentToHex(arr[1]) + componentToHex(arr[2]);
	}

});