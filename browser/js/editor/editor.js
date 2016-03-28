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

	// if we want to use double click for file upload we'll need to expand upon this
	// $scope.uploadImage = function(event) {
	// 	var id = event.currentTarget.id;
	// }

	$scope.imageUpload = function(element) {
		var imageBox = $(element).closest('.image-box');
	  var file = element.files[0];
	  var reader  = new FileReader();
	  
	  reader.addEventListener("load", function () {
	  	var image = reader.result;
	  	imageBox.css('background-image', 'url(' + image + ')');
	    Wireframe.uploadImage($scope.wireframe.project, $scope.wireframe._id, imageBox.attr('id'), image);
	  }, false);

	  reader.readAsDataURL(file);
	};

	//Z-index arrangement

	$scope.moveForward = function(){
		if(!$scope.active) return;
		var zIndex = getZindex($scope.active);

		$scope.components.forEach(el => {
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

		$scope.components.forEach(el => {
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
		$scope.components.forEach(el => {
			let elZ = getZindex(el);
			if(elZ > zIndex) el.style['z-index'] = elZ - 1;
		});

		zIndex = max;
		$scope.active.style['z-index'] = zIndex;
	};

	$scope.moveToBack = function(){
		if (!$scope.active) return;
		var zIndex = getZindex($scope.active);

		$scope.components.forEach(el => {
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

	function getZindex(el){
		return Number(el.style['z-index']);
	}

	function setZindex(el,zIndex){
		el.style['z-index'] = zIndex;
	}

	function getMaxZ(){
		var maxZ = 0;
		var elementArray = $scope.components;
		elementArray = elementArray.sort(function(a,b){
			return getZindex(a) - getZindex(b);
		})
		elementArray.forEach(function(el,index){
			setZindex(el, index);
		});
		return getZindex(elementArray.slice(-1)[0]);
	}

	function getZrange(){
		var elementArray = $scope.components;
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