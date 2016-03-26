app.directive('component', function ($compile) {
    function templateFinder(element, attr) {
      return '/js/common/directives/components/base-layer/base-layer.html'
      console.log('our attributes',attr);
      switch(attr.type) {
        case 'base-layer': return '/js/common/directives/components/base-layer/base-layer.html';
        case 'circle': return '/js/common/directives/components/circle/circle.html';
        case 'box': return '/js/common/directives/components/box/box.html';
        case 'text-box': return '/js/common/directives/components/text-box/text-box.html';
        case 'image-box': return '/js/common/directives/components/image-box/image-box.html';
        case 'list': return '/js/common/directives/components/list/list.html';
        case 'table-component': return '/js/common/directives/components/table-component/table-component.html';
        case 'button-component': return '/js/common/directives/components/button-component/button-component.html';
        default: return '/js/common/directives/components/base-layer/base-layer.html'
      }
    }

    return {
        restrict: "E",
        templateUrl: templateFinder,
        link: function(scope, element, attrs) {
          console.log('here is our ', element)
          element.html('<h1>Woo</h1>').show();

          $compile(element.contents())(scope);
        }
    };
});