app.controller("LoginController", ['$scope', '$routeParams', '$location', 'DataService', '$rootScope',
function ($scope, $routeParams, $location, dataService, $rootScope) {
  $scope.pageTitle = "Welcome to CMS DEX";
  $scope.loggedIn = false;
  
  $scope.signIn = function() {
    if ($scope.username === 'cms' || $scope.username === 'state') {
      
      $scope.loggedIn = true;    
      $rootScope.$broadcast('loggedIn');
      var userId;
      if ($scope.username === 'cms') {
        userId = 2;
      } else if ($scope.username === 'state') {
        userId = 4;
      }
      dataService.getUser(userId).then(function(data){
        $rootScope.$broadcast('gotUser', data);
      })
    }
    $location.path('/actions');  
  }

  //set watcher on log out link 
  var logOutBtn = angular.element(document.querySelectorAll('#log-out-btn')[0]);
  logOutBtn.on('click', function(){
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

}]);
