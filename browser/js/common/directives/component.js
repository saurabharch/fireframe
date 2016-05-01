app.directive('component', function ($compile, CSS, Firebase, $templateRequest) {
    function templateFinder(type) {
      switch(type) {
        case 'base-layer': return '/js/common/directives/components/base-layer.html';
        case 'circle': return '/js/common/directives/components/circle.html';
        case 'box': return '/js/common/directives/components/box.html';
        case 'text-box': return '/js/common/directives/components/text-box.html';
        case 'image-box': return '/js/common/directives/components/image-box.html';
        case 'list': return '/js/common/directives/components/list.html';
        case 'table-component': return '/js/common/directives/components/table-component.html';
        case 'button-component': return '/js/common/directives/components/button-component.html';
        case 'phone': return '/js/common/directives/components/phone-component.html'
        default: return '/js/common/directives/components/base-layer.html'
      }
    }

    return {
      restrict: "E",
      scope: {
        content: '='
      },
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
          if (attr.type === 'text-box') {
            scope.content = scope.content || 'Your Text Here';
          } else if (attr.type ==='list') {
              if (!scope.content.list) {
                scope.content = {};
                scope.content.list = {};
              }
              scope.content.list.header = scope.content.list.header || 'Header';
              scope.content.list.items = scope.content.list.items || ['List line 1', 'List Line 2', 'List Line 3'];
          } else {
            scope.content = null;
          }

          var selectedElement;
          element.on('mousedown', function(e){
            selectedElement = $(this);
          });

          $(window).on('mouseup', function(e) {
            if (selectedElement) {
              var id = selectedElement.attr('id');

              //listen for mouseup on window instead of element, to account for cursor being outside of element's area
              var style = CSS.extractStyle(selectedElement);
              Firebase.updateComponent(id, style, scope.content);
            }
            selectedElement = null;
          })

          scope.deleteElement = function() {
            Firebase.deleteElement($(element).attr('id'));
          }
        }
      }
    };
});