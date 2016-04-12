app.factory('FirebaseFactory', function(Session, Wireframe, CSS, $rootScope, $log, $timeout) {
  var firebase;
  var firebaseComponents;
  var firebaseUsers;
  var currentUser = Session.id || Math.round(100000*Math.random());
  var activeUsers = [];
  var undoHistory = [];
  var redoHistory = [];

  //Cache of components that we will reference from the editor scope
  var componentCache = [];
  var currentScope;


  //need to fix this, all components get deleted when a single user closes their browser window
  $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
    if (fromState.name==='editor') {
      if (firebaseUsers) {
        firebaseUsers.child(currentUser).remove()
      }
      firebaseComponents.onDisconnect().cancel()
      firebaseComponents = null
      firebaseUsers = null;
      firebase = null;
      activeUsers = [];
      componentCache = [];
    }
  });

  function logCurrentState() {
    undoHistory.push(angular.copy(componentCache, []));
    if (undoHistory.length > 5) undoHistory.shift();
  }

  //on any action, before changing the cache, we push the whole componentCache into the undoHistory array
  //if ctrl-z is pressed, we reset the componentCache to the popped of value from the undoHistory
  //that popped off value is pushed into the redoHistory
  //on any user action that is not undo, we clear the redoHistory

  var factory = {
    setScope: function($scope) {
      currentScope = $scope;
    },

    connect: function(wireframeId, projectId) {
      //don't think we need to do three firebase refs, maybe just one and add child...not sure which is better
      firebase = new Firebase("https://shining-torch-5682.firebaseio.com/projects/" + projectId + "/wireframes/" + wireframeId);
      firebaseUsers = new Firebase("https://shining-torch-5682.firebaseio.com/projects/" + projectId + "/wireframes/" + wireframeId + "/users");
      firebaseComponents = new Firebase("https://shining-torch-5682.firebaseio.com/projects/" + projectId + "/wireframes/" + wireframeId + "/components");

      /* Here we set up the events for users joining and leaving a room */
        //add current user to room
        firebaseUsers.child(currentUser).set('connected');
        firebaseUsers.child(currentUser).onDisconnect().remove();
        //for every user change, set up disconnect handler depending on number of users currently connected
        //this feels quite hacky, though I can't figure out a good way to delete components if everyone leaves a room
        function setOnDisconnect() {
          if(activeUsers.length<=1) {
            firebaseComponents.onDisconnect().remove();  
          } else {
            firebaseComponents.onDisconnect().cancel();
          }          
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

      /* Here we set up the events for elements being added, changed or removed from the room */
        //Event listener, create element any time a user adds one
        firebaseComponents.on('child_added', function(snapshot) {
          var element = snapshot.val();
          element.id = snapshot.key();
          logCurrentState();
          componentCache.push(element);
          $timeout();
        });

        //Event listener, edit element any time a user changes one
        firebaseComponents.on('child_changed', function(snapshot) {
          var element = snapshot.val();
          var id = snapshot.key();
          logCurrentState();
          CSS.removeTransform(id);
          //find the component changed, and update the properties
          componentCache.forEach(function(component) {
            if (component.id === id) {
              component.style = element.style;
              component.type = element.type;
              component.content = element.content;
            }
          });
          $timeout();
        });

        //Event listener, delete element any time a user removes one
        firebaseComponents.on('child_removed', function(snapshot) {
          var element = snapshot.val();
          var id = snapshot.key();
          var index;

          logCurrentState();
          componentCache.forEach(function(component, i) {
            if (component.id===id) index = i;
          });

          componentCache.splice(index, 1);
          $timeout();
        });
    },

    checkForUsers: function(wireframeId, projectId) {
      var firebase = new Firebase("https://shining-torch-5682.firebaseio.com/projects/" + projectId + '/wireframes/' + wireframeId + '/users');
      
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
      })
      .then(wireframes => {
        var activeWires = [];
        wireframes.forEach(frame => {
          if(frame.hasChild('users')) {
            activeWires.push(frame);
          }
        })
        return activeWires;
      })
      .then(null, $log)

    },

    createRoom: function(wireframe) {
      factory.connect(wireframe._id, wireframe.project);
      
      //load current components to firebase
      if (wireframe.components) {
        wireframe.components.forEach(function(component) {
          factory.createElement(component);
        });
      }
      //return a reference to the component cache
      return componentCache;
    },

    joinRoom: function(wireframeId, projectId) {
      factory.connect(wireframeId, projectId);
      //load in existing firebase objects

      return new Promise(function(resolve, reject) {
        firebaseComponents.once('value', function(data) {
          resolve(data.components || null);
        }, function(err) {
          reject(err);
        })
      })
      .then(components => {
        return componentCache;
      }) 
    },

    createElement: function(component) {
      firebaseComponents.push({
        style: component.style || '',
        type: component.type || '',
        content: component.content || ''
      });

    },

    deleteElement: function(id) {
      firebaseComponents.child(id).remove();
    },

    createImage: function(file, scope, style) {
      factory.createElement(style, 'image-box');
    },

    updateComponent: function(id, style, content) {
      firebaseComponents.child(id).update({
        style: style || '',
        content: content || ''
      });
    },

    getComponentCache: function() {
      return componentCache;
    },

    undo: function() {
      var pastState = undoHistory.pop();
      componentCache.length = 0;
      angular.merge(componentCache, pastState);
      firebaseComponents.set(componentCache);
    },

    redo: function () {

    },

    //get components array, which is either generated from joining an exisiting room or fetching from the backend and creating a room
    fetchComponents: function(id, projectId) {
      componentCache = [];
      return factory.checkForUsers(id, projectId)
      .then(users => {
        //if room doesn't exist, fetch the wireframe and create a firebase room
        if (!users.val()) {
          return Wireframe.fetchOne(id, projectId)
          .then(wireframe => {
            wireframe.project = projectId;
            return factory.createRoom(wireframe);
          })
        } else {
          //otherwise, join room, which returns a reference to the componentCache
          return factory.joinRoom(id, projectId);
        }
      })
      .then(null, function(err){
        console.log(err);
      })
    }
  };

  return factory;
});

