app.directive('navbar', function ($rootScope, AuthService, AUTH_EVENTS, $state) {
  return {
    restrict: 'E',
    scope: {},
    templateUrl: 'js/common/directives/navbar/navbar.html',
    link: function (scope) {
      scope.isCollapsed=true;
      scope.state = $state;

      scope.items = [
        { label: 'My Dashboard', state: 'dashboard.allProjects', auth: true }
      ];

      scope.toggle = function () {
        scope.isCollapsed = !scope.isCollapsed;
      }

      scope.toggleSide = function() {

      }

      scope.user = null;

      scope.isLoggedIn = function () {
        return AuthService.isAuthenticated();
      };

      scope.logout = function () {
        AuthService.logout().then(function () {
          $state.go('home');
        });
      };

      var setUser = function () {
        AuthService.getLoggedInUser().then(function (user) {
          scope.user = user;
        });
      };

      var removeUser = function () {
        scope.user = null;
      };

      setUser();

      $rootScope.$on(AUTH_EVENTS.loginSuccess, setUser);
      $rootScope.$on(AUTH_EVENTS.logoutSuccess, removeUser);
      $rootScope.$on(AUTH_EVENTS.sessionTimeout, removeUser);
    }
  };
});


app.directive('sideNav', ["$rootScope", "$state", "$uibModal", function ($rootScope, $state, $uibModal) {
  return {
    restrict: 'E',
    templateUrl: 'js/common/directives/navbar/side-nav.html',
    link: function (scope, element, attr) {
      scope.state = $state;

      $('.sidebar li').click(function() {
        if($(this).find('a').hasClass('add')) return;
        $('.sidebar li').removeClass('active');
        $(this).addClass('active');
      });

      scope.newProject = function () {
        var modalInstance = $uibModal.open({
          templateUrl: '/js/dashboard/dashboard.new-project.html',
          controller: 'ModalInstanceCtrl',
          size: 'sm',
          resolve: {
            user: function(AuthService, User, $log) {
              var user;
              return AuthService.getLoggedInUser()
              .then(currentUser => {
                user = currentUser;
                return User.getUserTeams(user._id)
              })
              .then(teams => {
                user.teams = teams;
                return user;
              })
              .catch(function(err) {
                console.log(err);
                return user;
              })
            }
          }
        });
      };
    }
  };
}]);
