describe('Firebase', function() {
  beforeEach(module('FullstackGeneratedApp'));

  var $rootScope, $scope, $httpBackend;
  beforeEach('Get tools', inject(function (_$httpBackend_, _$rootScope_, $templateCache) {
    $httpBackend = _$httpBackend_;
    $rootScope = _$rootScope_;
    $scope = _$rootScope_.$new();
    $templateCache.put('js/home/home.html', 'test');
  }));

  var FirebaseFactory, Wireframe, WireStubFetch;
  beforeEach('Get factories', inject(function (_FirebaseFactory_, _Wireframe_) {
    FirebaseFactory = _FirebaseFactory_;
    Wireframe = _Wireframe_;
    window.Firebase = function () {
      this.once = function (event, cb) {
        var users = {};
        users.val = function() { return null };
        cb(users);
      }
    }
    FirebaseFactory.connect = function(){ return true };
    WireStubFetch = sinon.stub(Wireframe, 'fetchOne', function() {
      return new Promise(function(resolve, reject) {
        resolve({}),
        reject('Bad request');
      })
    })
  }));

  describe('fetchComponents', function(done) {
    
    it('should call Wireframe factory fetchOne', function(done) {
      FirebaseFactory.fetchComponents('1234', 'abc').then(function() {
        expect(WireStubFetch.called).to.be.ok;
        done();
      })
      .then(null, done);
    });

    it('should also create a firebase room', function(done) {
      var spy = sinon.spy(FirebaseFactory, 'createRoom');
      FirebaseFactory.fetchComponents('1234', 'abc').then(function() {
        expect(spy.called).to.be.ok;
        done()
      })
      .then(null, done);
    })

    it('if a user is in the room, it should join the room', function(done) {
      window.Firebase = function() {
        this.once = function(event, cb) {
          var users = {};
          users.val = function() { return "User exists" };
          cb(users);
        }
      }

      var stub = sinon.stub(FirebaseFactory, 'joinRoom');
      FirebaseFactory.fetchComponents('1234', 'abc').then(function() {
        expect(stub.called).to.be.ok;
        done();
      });
    })
  });
});
