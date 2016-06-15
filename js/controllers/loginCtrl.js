app.controller("LoginController", 
  function ($scope, $routeParams, $location, DataService, $rootScope, SessionService, AuthorizationService) {
  $scope.pageTitle = "Welcome to CMS DEX";
  $scope.loggedIn = false;
  $scope.users = [];

  $scope.signIn = function() {
    $scope.loggedIn = true;    
    $rootScope.$broadcast('loggedIn');

    SessionService.setUser($scope.user);
    AuthorizationService.assignPermissions();
    if (SessionService.currentUser !== null)
      $location.path('/actions');  
  }

  //set watcher on log out link 
  var logOutBtn = angular.element(document.querySelectorAll('#log-out-btn')[0]);
  logOutBtn.on('click', function(){
    SessionService.currentUser = null;
    $rootScope.$broadcast('loggedOut');
  })
  

  //Handle logged in behavior 
  $rootScope.$on('loggedIn', function(event, data){
    var el = document.querySelectorAll('.sidebar-container')[0];
    angular.element(el).removeClass('hidden');
    var main = angular.element(document.querySelector('.usa-section'));
    main.addClass('with-sidebar');
  })

  //Handle logged out behavior 
  $rootScope.$on('loggedOut', function(event, data){
    var el = document.querySelectorAll('.sidebar-container')[0];
    angular.element(el).addClass('hidden');
    var main = angular.element(document.querySelector('.usa-section'));
    main.removeClass('with-sidebar');
    $location.path('/');
  })

  DataService.getAllUsers().then(function(data) { 
    $scope.users = data;
  });

});
