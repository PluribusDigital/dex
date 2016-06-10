app.controller("LoginController", ['$scope', '$routeParams', '$location', 'DataService', '$timeout',
function ($scope, $routeParams, $location, dataService, $timeout) {
  $scope.pageTitle = "Welcome to CMS DEX";
  
  $scope.signIn = function() {
    if ($scope.username === 'cms' || $scope.username === 'state') {
      $location.path('/actions');
    }
  }

}]);
