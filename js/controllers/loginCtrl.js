app.controller("LoginController", ['$scope', '$routeParams', '$location', 'DataService', '$timeout',
function ($scope, $routeParams, $location, dataService, $timeout) {
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
    }
  }

}]);
