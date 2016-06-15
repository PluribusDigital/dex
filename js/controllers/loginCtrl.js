app.controller("LoginController", 
  function ($scope, $location, DataService, $rootScope, SessionService, AuthorizationService) {
  $scope.pageTitle = "Welcome to CMS DEX";
  $scope.showSidebar = $location.path() !== '/';
  $scope.users = [];

  $scope.signIn = function() {
    SessionService.setUser($scope.user);
    AuthorizationService.assignPermissions();
    if (SessionService.getUser() !== null)
      $location.path('/actions');  

    $rootScope.$broadcast('loggedIn');
  }

  //set watcher on log out link 
  var logOutBtn = angular.element(document.querySelectorAll('#log-out-btn')[0]);
  logOutBtn.on('click', function(){
    SessionService.setUser(null);
    $rootScope.$broadcast('loggedOut');
  })

  //Handle logged out behavior 
  $rootScope.$on('loggedOut', function(event, data){
    $location.path('/');
  })

  DataService.getAllUsers().then(function(data) { 
    $scope.users = data;
  });

  $rootScope.$on('$routeChangeStart', function (ev, to, toParams, from, fromParams) {
    $scope.showSidebar = $location.path() !== '/';
  });
});
