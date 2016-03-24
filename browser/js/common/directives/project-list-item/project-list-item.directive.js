app.directive('projectItem', function () {
    return {
        restrict: 'E',
        templateUrl: 'js/common/directives/project-list-item/project-list-item.html',
        scope:{
        	project:'='
        }
    };
});