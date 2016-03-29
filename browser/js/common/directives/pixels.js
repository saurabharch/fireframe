app.directive('pixels', function() {
    return {
        restrict: 'A',
        require: 'ngModel',
        link: function(scope, element, attr, ngModel) {
            function fromUser(value) {
						   return (value || 0) + 'px'
						}

						function toUser(value) {
							console.log('our value', value);
						  return value ? value.slice(0, -2) : '0px';
						}
						ngModel.$parsers.push(fromUser);
						ngModel.$formatters.push(toUser);
        }
    };
});