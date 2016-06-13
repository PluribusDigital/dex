app.directive('sidebar', function() {
  return {
    restrict: 'A',
    scope: {},
    templateUrl: 'templates/partials/sidebar.html',
    controller: 'LoginController'
  };
});