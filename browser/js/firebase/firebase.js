app.factory('Firebase', function(Component, AuthService) {
  var firebaseComponents
  var firebaseUsers;
  var currentUsers = [];

  var factory = {
    connect: function(wireframeId, $scope) {
      firebaseComponents = new Firebase("https://shining-torch-5682.firebaseio.com/projects/" + wireframeId + "/components");
      firebaseUsers = new Firebase("https://shining-torch-5682.firebaseio.com/projects/" + wireframeId + "/users");
      
      //on connect => add user to firebase room
      //on user added => push into every other user's array
      //on on disconnect => check if user array is length 1
      //    => if yes, clear data from room
      //    => if no, just send user removed event
      //Event listener, create element any time a user adds one
      // firebaseUsers.on('child_added', function(snapshot) {
      //   var key = snapshot.key();
      //   var element = snapshot.val();
      //   Component.create(element.type, $scope, element.style, key);
      // });

      // firebaseUsers.on('child_changed', function(snapshot) {
      //   var key = snapshot.key();
      //   var element = snapshot.val();
      //   Component.update(key, element.style);
      // });

      // firebaseUsers.on('child_removed', function(snapshot) {
      //   var key = snapshot.key();
      //   var element = snapshot.val();
      //   Component.deleteComponent(key);
      // });

      //Event listener, create element any time a user adds one
      firebaseComponents.on('child_added', function(snapshot) {
        var key = snapshot.key();
        var element = snapshot.val();
        Component.create(element.type, $scope, element.style, key);
      });

      firebaseComponents.on('child_changed', function(snapshot) {
        var key = snapshot.key();
        var element = snapshot.val();
        Component.update(key, element.style);
      });

      firebaseComponents.on('child_removed', function(snapshot) {
        var key = snapshot.key();
        var element = snapshot.val();
        Component.deleteComponent(key);
      });

      //Event listener, update element any time a user changes it
      var selectedElement;
      $('#wireframe-board').on('mousedown', '.resize-drag', function(event) {
        selectedElement = $(this);
        $(window).on('mouseup', function() {
          var component = Component.saveComponent(selectedElement);
          var key = component.id;
          firebaseComponents.child(key).update({
            style: component.style
          });
        })
      });
    },

    createRoom: function(wireframe, $scope) {
      factory.connect(wireframe._id, $scope);
      
      //load current components to fb
      if (wireframe.components) {
        wireframe.components.forEach(function(component) {
          factory.createElement(component.style, component.type);
        });
      }
    },

    joinRoom: function(wireframe, $scope) {
      factory.connect(wireframe._id, $scope);
      
      //load in existing firebase objects
      firebaseComponents.once('value', function(data) {
        data.components.forEach(function(component) {
          Component.create(component.type, $scope, component.style, component.id);
        })
      });
    },

    createElement: function(style, type) {
      firebaseComponents.push({
        style: style,
        type: type
      });
    },

    deleteElement: function(event) {
      var innerDiv = event.target.parentNode;
      var outerDiv = innerDiv.parentNode;
      var outerouterDiv = outerDiv.parentNode;
      var id = outerouterDiv.id;
      console.log(id, "the ID"); //gotta figure out how to put ID in the button div to avoid the parent parent parent...
      firebaseComponents.child(id).remove(function() {
        console.log("deleting element?? ?");
      });
    },

    updateElement: function(element, style) {
      Component.update(element.id, style);
    }


  }
  return factory;

});

