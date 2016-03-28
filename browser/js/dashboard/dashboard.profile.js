'use strict';

app.config(function($stateProvider) {
  $stateProvider.state('dashboard.profile', {
    url: '/profile',
    templateUrl: '/js/dashboard/dashboard.profile.html',
    controller: 'ProfileCtrl',
    resolve: {
      profile: function(User, AuthService) {
        return AuthService.getLoggedInUser()
      }
    }
  })
});

app.controller('ProfileCtrl', function($scope, $state, profile) {
  $scope.profile = profile;

});