app.config(function($stateProvider){
	$stateProvider.state('editor', {
		url: '/editor/:projectId/edit/:id',
		templateUrl: '/js/editor/editor.html',
		resolve: {
			wireframe: function($stateParams) {
				return { _id: $stateParams.id, project: $stateParams.projectId }
			},
			components: function($stateParams, Wireframe, FirebaseFactory) {
				return FirebaseFactory.fetchComponents($stateParams.id, $stateParams.projectId)
			}
		},
		controller: 'EditorCtrl'
		});
});

app.controller('EditorCtrl', function($scope, wireframe, components, Interact, CSS, FirebaseFactory, Wireframe, $timeout) {
	$scope.components = FirebaseFactory.getComponentCache();
	$scope.wireframe = wireframe;
	$scope.copy;
	$scope.board = $('#wireframe-board');
	FirebaseFactory.setScope($scope);

	$scope.activeOpacity = 1;
	$scope.activeColor = "#FFF";

	//initialize dragging and resizing
	Interact.dragAndResize();

	//set current zoom and initialize CSS zoom
	$scope.currentZoom = CSS.currentZoom();
	$scope.updateZoom = CSS.updateZoom;

	$scope.deleteElement = FirebaseFactory.deleteElement;

	$scope.createElement = function(type) {
		var style = { "opacity":$scope.activeOpacity, "z-index": getZrange()};
		FirebaseFactory.createElement({ style: style, type: type });
	};
	
	$scope.setStyle = function(style) {
		return style;
	}

	$scope.setSource = function(source) {
		return source;
	}

	$scope.setActive = function(component) {
		if ($scope.active) $('#'+$scope.active.id).removeClass('active-component');
		$scope.active = component;
		$('#'+$scope.active.id).addClass('active-component');
	}

	$scope.save = function () {
		Wireframe.save($scope.wireframe, $scope.components);
	};

	$scope.deleteElement = function() {
		FirebaseFactory.deleteElement($scope.active.id);
	}

	$scope.changeListLength = function(e) {
		var currentLength = $scope.active.list.length;
	}

	$scope.$watch('active', function() {
		if ($scope.active) {
			FirebaseFactory.updateComponent($scope.active.id, $scope.active.style, $scope.active.content);
		}
	}, true)

	//Event listeners

	$scope.board.on('mousedown',function(){
		if ($scope.active) {
			$('#'+$scope.active.id).removeClass('active-component');
		}
		$scope.active = null;
	});

	$scope.copyElement = function() {
		$scope.copy = {};
		angular.copy($scope.active, $scope.copy);
	}

	$scope.pasteElement = function() {
		if ($scope.copy) {
			$scope.copy.style.left += 20;
			$scope.copy.style.top += 20;
			$scope.copy.style['z-index'] = getZrange();
			FirebaseFactory.createElement({
				style: $scope.copy.style,
				type: $scope.copy.type,
				content: $scope.copy.content
			})
		}
	}

	$scope.undoAction = function() {
		FirebaseFactory.undo();
	}

	$scope.redoAction = function() {
		FirebaseFactory.redo();
	}

	//listen for delete key, prevent default, and ensure we are not within an active text-box
	$(document).on("keydown", function (event) {
		var active = $(document.activeElement);

    if (event.keyCode === 8 && !active[0].isContentEditable && !active.is('input')) {
   		event.preventDefault();
    	if ($scope.active) {
    		$scope.deleteElement();
    		$scope.active = null;
    	}
    }

    if (event.keyCode === 16) {
    	Interact.preserveAspectRatio();
    }
  });

  $(document).on('keyup', function() {
  	Interact.removeAspectRatio();
  })

	$scope.imageUpload = function(element) {
		var imageBox = $(element).closest('.image-box');
	  var file = element.files[0];
	  var reader  = new FileReader();
	  
	  reader.addEventListener("load", function () {
	  	var image = reader.result; 
			var img = new Image();     
			img.onload = function(){
			  var width = img.width, height = img.height;
	  		imageBox.css('background-image', 'url(' + image + ')');
	  		imageBox.width(width);
	  		imageBox.height(height);
				FirebaseFactory.updateComponent(imageBox.attr('id'), { width: width, height: height });
			};
			img.src = image;
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