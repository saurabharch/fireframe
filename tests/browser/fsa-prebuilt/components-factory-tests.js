// describe('Components factory', function() {
  
//   beforeEach(module('FullstackGeneratedApp'));

//   var Component, $scope, $rootScope;


//   beforeEach(inject(function(_Component_, _$rootScope_){
//     Component = _Component_;
//     $rootScope = _$rootScope_;
//     $scope = _$rootScope_.$new();
//   }));

//   it('creates different types of components', function(){
//     var newComponent = Component.create();
//     console.log(newComponent, "the new component");
//     expect(newComponent).to.be.an('object');

//   });

// });

//changed browser in karma.conf.js


describe('Firebase and Wireframe factories', function() {
  beforeEach(module('FullstackGeneratedApp'));

  var $rootScope, $scope, $httpBackend;
  beforeEach('Get tools', inject(function (_$httpBackend_, _$rootScope_) {
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    //$scope = _$rootScope_.$new();
  }));

  var Firebase, Wireframe;
  beforeEach('Get factories', inject(function (_Firebase_, _Wireframe_) {
    Firebase = _Firebase_;
    Wireframe = _Wireframe_;
  }));

  describe('fetchComponents', function() {

    afterEach(function () {
      $httpBackend.verifyNoOutstandingExpectation();
      $httpBackend.verifyNoOutstandingRequest();
    });

    it('should make a GET request to the backend, instead of to Firebase', function(done) {
      $httpBackend.expectGET('/api/wireframes/1234');
      $httpBackend.whenGET('/api/wireframes/1234').respond({
        style: {},
        type: 'box'
      });
      
      Firebase.fetchComponents('1234', 'abc').then(function() {
        done()
      })
      
      $httpBackend.flush();
    });

    it('should create a room', function() {
      $httpBackend.expectGET('/1234');
      $httpBackend.whenGET('/api/wireframes/1234').respond({
        style: {},
        type: 'box'
      });

      Firebase.fetchComponents('1234', 'abc').then(function() {
        expect(Firebase.createRoom).to.have.been.called
        done()
      });
      
      $httpBackend.flush();
    })
    // $httpBackend.whenGET('/1234').respond({
    //     style: {
    //       'background-color': 'blue',
    //       width: '100px',
    //       height: '100px'
    //     }, 
    //     type: 'base-layer' 
    //   });
  });

});