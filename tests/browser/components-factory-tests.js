describe('Components factory', function() {
  
  beforeEach(module('FullstackGeneratedApp'));

  var Component, $scope, $rootScope;


  beforeEach(inject(function(_Component_, _$rootScope_){
    Component = _Component_;
    $rootScope = _$rootScope_;
    $scope = _$rootScope_.$new();
  }));

  it('creates different types of components', function(){
    var newComponent = Component.create();
    console.log(newComponent, "the new component");
    expect(newComponent).to.be.an('object');

  });





  
});

//changed browser in karma.conf.js
