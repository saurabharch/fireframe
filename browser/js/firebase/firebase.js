app.factory('Firebase', function(Component) {

  var firebase;

  var factory = {
    connect: function(wireframeId, $scope) {
      firebase = new Firebase("https://resplendent-torch-9329.firebaseio.com/projects/" + wireframeId);
      
      //Event listener, create element any time a user adds one
      firebase.on('child_added', function(snapshot) {
        var key = snapshot.key();
        var element = snapshot.val();
        console.log(snapshot.val(), key, "snapshot");
        Component.create(element.type, $scope, element.style, key);
      });

      //Event listener, update element any time a user changes it
      $('#wireframe-board').on('click', '.resize-drag', function(event) {
        var component = Component.saveComponent($(this));
        console.log(component, "component");
        var key = component.id;
        firebase.child(key).update({
          style: component.style
        });
      });
    },

    createRoom: function(wireframe, $scope) {
      factory.connect(wireframe._id, $scope);
      
      //load current components to fb
      wireframe.components.forEach(function(component) {
        firebase.push({
         id: component.id,
         style: component.style,
         type: component.type 
        });
      });
    },

    joinRoom: function(wireframe, $scope) {
      factory.connect(wireframe._id, $scope);
      
      //load in existing firebase objects
      firebase.once('value', function(data) {
        console.log(data);
        data.components.forEach(function(component) {
          Component.create(component.type, $scope, component.style, component.id);
        })
      });
    },

    createElement: function(style, type) {
      firebase.push({
        style: style,
        type: type
      });
    },

    deleteElement: function() {

    },

    updateElement: function() {

    }


  }
  return factory;

});

