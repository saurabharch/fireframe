app.directive('component', function ($compile, CSS, Firebase, $templateRequest) {
    function templateFinder(type) {
      console.log('attribute', type);
      //return '/js/common/directives/components/base-layer/base-layer.html'
      switch(type) {
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
      scope: {},
      link: {
        pre: function (scope, element, attrs) {
          var url = templateFinder(attrs.type);
          $templateRequest(url)
          .then(function(res) { 
            // compile the html, then link it to the scope
            var $elem = $compile(res)(scope);
            // append the compiled template inside the element
            element.append($elem);
          });
        },

        post: function (scope, element, attr){
          var selectedElement;
          element.on('mousedown', function(e){
            console.log('mousedown');
            selectedElement = $(this);
          });

          $(window).on('mouseup', function(e) {
            if (selectedElement) {
              console.log('mouseup');
              var id = selectedElement.attr('id');

              //listen for mouseup on window instead of element, to account for cursor being outside of element's area
              var style = CSS.extractStyle(selectedElement);
              Firebase.updateComponent(id, style);
            }
            selectedElement = null;
          })
        }
      }
    };
});