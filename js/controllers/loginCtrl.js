app.controller("LoginController",
  function ($scope, $location, UserService, $rootScope, SessionService, AuthorizationService, DataService) {
  $scope.pageTitle = "Welcome to CMS DEX";
  $scope.showSidebar = $location.path() !== '/';
  $scope.users = [];
  $scope.currentPath = $location.path();

  $scope.signIn = function() {
    // Update last logged in
    var date = new Date();
    date = date.toISOString();
    var putData = {
      "username": $scope.user.username,
      "fullname": $scope.user.fullname,
      "type": $scope.user.type,
      "state_id": $scope.user.state_id,
      "last_login": date
    };
    DataService.updateUserLastLogin(JSON.stringify(putData), $scope.user.id).then(function(res){
      $scope.user = res.data;
      SessionService.setUser($scope.user);
    })
    
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
  });

  //Handle logged out behavior
  $rootScope.$on('loggedOut', function(event, data){
    $location.path('/');
  })

  UserService.getAll().then(function(data) {
    $scope.users = data;
  });

  $rootScope.$on('$routeChangeStart', function (ev, to, toParams, from, fromParams) {
    $scope.showSidebar = $location.path() !== '/';
    $scope.currentPath = $location.path()
  });
});
