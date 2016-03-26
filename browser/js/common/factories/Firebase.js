app.factory('Firebase', function(Component, Session, Wireframe) {
  var firebase;
  var firebaseComponents
  var firebaseUsers;
  var currentUser = Session.id || Math.round(100*Math.random());
  var activeUsers = [];

  var componentCache = [];

  var factory = {
    connect: function(wireframe, $scope) {
      //don't think we need to do three firebase refs, maybe just one and add child...not sure which is better
      firebase = new Firebase("https://shining-torch-5682.firebaseio.com/projects/" + wireframe.project + "/wireframes/" + wireframe._id);
      firebaseUsers = new Firebase("https://shining-torch-5682.firebaseio.com/projects/" + wireframe.project + "/wireframes/" + wireframe._id + "/users");
      firebaseComponents = new Firebase("https://shining-torch-5682.firebaseio.com/projects/" + wireframe.project + "/wireframes/" + wireframe._id + "/components");
      
      //add current user to room
      firebaseUsers.child(currentUser).set('connected');
      
      //for every user change, set up disconnect handler depending on number of users currently connected
      //this feels quite hacky, though I can't figure out a good way to delete components if everyone leaves a room
      function setOnDisconnect() {
        if(activeUsers.length<=1) {
          firebase.onDisconnect().remove();  
        } else {
          firebase.onDisconnect().cancel();
          firebaseUsers.onDisconnect().cancel();
        }
        firebaseUsers.child(currentUser).onDisconnect().remove();
      };

      //Event listener, log users joining room
      firebaseUsers.on('child_added', function(snapshot) {
        activeUsers.push(snapshot.key());
        setOnDisconnect();
      });

      //Event listener, log users leaving room
      firebaseUsers.on('child_removed', function(snapshot) {
        activeUsers = activeUsers.filter(function(user) {
          return user !== snapshot.key();
        })
        setOnDisconnect();
      });

      //Event listener, create element any time a user adds one
      firebaseComponents.on('child_added', function(snapshot) {
        var key = snapshot.key();
        var element = snapshot.val();
        element.id = key;
        componentCache.push(element);
        console.log('child added', componentCache)
        //Component.create(element.type, $scope, element.style, key);
      });

      //Event listener, edit element any time a user changes one
      firebaseComponents.on('child_changed', function(snapshot) {
        var key = snapshot.key();
        var element = snapshot.val();
        componentCache.forEach(function(component) {
          if (component.id === key) {
            component.style = element.style;
            component.type = element.type;
            component.source = element.source;
          }
        })
        console.log('child changed', componentCache)
        //Component.update(key, element.style);
      });

      //Event listener, delete element any time a user removes one
      firebaseComponents.on('child_removed', function(snapshot) {
        var key = snapshot.key();
        var element = snapshot.val();
        var index;

        componentCache.forEach(function(component, i) {
          if (component.id===key) index = i;
        });

        componentCache.splice(index, 1);
        console.log(componentCache, 'child removed')
        //Component.deleteComponent(key);
      });

      //Event listener, update element any time a user changes it
      var selectedElement;
      $('#wireframe-board').on('mousedown', '.resize-drag', function(event) {
        selectedElement = $(this);
        var uid = selectedElement.attr('id');

        $(window).on('mouseup', function() {
          var component = selectedElement;
          var key = component.id;
          firebaseComponents.child(uid).update({
            style: endStyle
          });
          console.log('current components', componentCache);
        });
      });
    },

    checkForComponents: function(wireframeId, projectId) {
      var firebase = new Firebase("https://shining-torch-5682.firebaseio.com/projects/" + projectId + '/wireframes/' + wireframeId);
      
      //firebase promises not working => made our own
      return new Promise(function(resolve, reject) {
        firebase.once('value', function(data) {
          resolve(data);
        }, function(err) {
          reject(err);
        });
      });
    },

    checkForWireframes: function(projectId){
      var firebase = new Firebase("https://shining-torch-5682.firebaseio.com/projects/" + projectId + '/wireframes/');
        
      //firebase promises r dum
      return new Promise(function(resolve, reject) {
        firebase.once('value', function(data) {
          resolve(data);
        }, function(err) {
          reject(err);
        });
      });

    },

    createRoom: function(wireframe) {
      factory.connect(wireframe);
      
      //load current components to firebase
      if (wireframe.components) {
        wireframe.components.forEach(function(component) {
          factory.createElement(component);
        });
      }

      return componentCache;
    },

    joinRoom: function(wireframe, $scope) {
      factory.connect(wireframe, $scope);
      
      //load in existing firebase objects
      return new Promise(function(resolve, reject) {
        firebaseComponents.once('value', function(data) {
          if (data.components) {
            resolve(data.components);
            // data.components.forEach(function(component) {
            //   Component.create(component.type, $scope, component.style, component.id);
            // })
          }
        }, function(err) {
          reject(err);
        })
      })
      .then(components => {
        componentCache = components;
        return componentCache;
      }) 
    },

    createElement: function(component) {
      firebaseComponents.push({
        style: component.style || '',
        type: component.type || '',
        source: component.source || ''
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
    },

    getComponentCache: function() {
      return componentCache;
    },

    //get components array, which is either generated from joining an exisiting room or fetch from the backend and creating a room
    getComponents: function(id, projectId) {
      factory.checkForComponents(id, projectId)
      .then(components => {
        if (!components.val()) {
          return Wireframe.fetchOne(id, projectId)
          .then(wireframe => {
            wireframe.project = projectId;
            return factory.createRoom(wireframe);
          })
        } else {
          //otherwise, join room and return a reference to the componentCache
          return factory.joinRoom()
        }
      })
      .then(null, function(err){
        console.log(err);
      })
    }

  }
  return factory;

});

