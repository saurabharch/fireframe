app.config(function ($stateProvider) {

    $stateProvider.state('login', {
        url: '/login',
        templateUrl: 'js/login/login.html',
        controller: 'LoginCtrl'
    });

});

app.controller('LoginCtrl', function ($scope, AuthService, $state, $http) {

    $scope.login = {};
    $scope.error = null;

    $scope.sendLogin = function (loginInfo) {

        $scope.error = null;

        AuthService.login(loginInfo).then(function () {
            $state.go('dashboard.allProjects');
        }).catch(function () {
            $scope.error = 'Invalid login credentials.';
        });

    };

    // $scope.googleAuth = function(){
    //     console.log("HELP");
    //     return $http.get('/auth/google/')
    //     .then(res => console.log(res));
    // };

});