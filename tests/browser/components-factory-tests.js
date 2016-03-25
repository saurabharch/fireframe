describe('Components factory', function() {
  
  beforeEach(module('FullstackGeneratedApp'));

  var Component;


  beforeEach(inject(function(_Component_){
    Component = _Component_;
  }));

  it('creates different types of components', function(){
    var newComponent = Component.create('base-layer', );
    expect( result ).toEqual( something );
  });





  
});

//changed browser in karma.conf.js