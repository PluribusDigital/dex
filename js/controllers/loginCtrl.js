app.controller("LoginController", ['$scope', '$routeParams', '$location', 'DataService', '$rootScope',
function ($scope, $routeParams, $location, dataService, $rootScope) {
  $scope.pageTitle = "Welcome to CMS DEX";
  $scope.loggedIn = false;
  
  $scope.signIn = function() {
    if ($scope.username === 'cms' || $scope.username === 'state') {
      $location.path('/actions');
      var el = document.querySelectorAll('.sidebar-container')[0];
      angular.element(el).removeClass('hidden');
      var main = angular.element(document.querySelector('.usa-section'));
      main.addClass('with-sidebar');
      $scope.loggedIn = true;
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
  }

}]);
